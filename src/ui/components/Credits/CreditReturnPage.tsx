'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  // TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import {
  AlertTriangleIcon,
  BadgeInfo,
  CheckCircleIcon,
  InfoIcon,
} from 'lucide-react';
import { useAppSelector } from '../../../app/hooks';
import { toast, Toaster } from 'sonner';
import {
  getPriceAdjustment,
  getProductUnitPrice,
  isDiscountApplied,
  NO_CASHIER_OPEN,
} from '../../../shared/helpers/salesHelper';
import {
  ICajaBrach,
  updateCashAmount,
} from '../../../app/slices/cashRegisterSlice';
import { ITransacionCredit } from '../../../interfaces/creditsInterfaces';
import { getFormatedDate } from '../../../shared/helpers/transferHelper';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui/popover';
import {
  IProductReturn,
  IProductSale,
  ITransactionReturn,
} from '../../../interfaces/salesInterfaces';
import { store } from '../../../app/store';
import { createCreditReturn } from '../../../app/slices/credits';

export default function CreditReturnPage({
  credit,
  setShowModal,
}: {
  credit: ITransacionCredit;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const userId = useAppSelector((state) => state.auth.signIn.user?._id);
  const caja = useAppSelector((state) => state.boxes.BoxesData);
  const userCashierList = caja?.filter((c) => {
    const usuarioId =
      typeof c.usuarioAperturaId === 'string'
        ? c.usuarioAperturaId
        : c.usuarioAperturaId?._id;

    return usuarioId === userId && c.estado?.toUpperCase() === 'ABIERTA';
  });
  const userCashier =
    userCashierList && userCashierList.length > 0 ? userCashierList[0] : null;

  const [returnProccessing, setReturnProccessing] = useState(false);
  const [returnQuantities, setReturnQuantities] = useState<{
    [key: string]: {
      quantity: number;
      priceAdjustment: number | null;
    };
  }>({});
  const [cashRegister, setCashRegister] = useState<{
    id: string | null;
    cash: number;
  }>({
    id: null,
    cash: 0,
  });
  const [extraCash, setExtraCash] = useState(0);

  const handleQuantityChange = (product: IProductSale, quantity: number) => {
    let priceAdjustment = null;
    const newQuantity = product.quantity - quantity;

    if (product.discount && quantity > 0 && newQuantity > 0) {
      const hasActiveDiscount = isDiscountApplied(
        credit.transaccion.sucursalId,
        quantity,
        product
      );

      if (!hasActiveDiscount) {
        priceAdjustment = getPriceAdjustment(product, newQuantity);
      }
    }

    setReturnQuantities((prev) => ({
      ...prev,
      [product.productId]: {
        priceAdjustment: priceAdjustment,
        quantity: quantity,
      },
    }));
  };

  const calculateTotalReturn = () => {
    const currentBalanceDue =
      credit?.credito?.saldoPendiente?.$numberDecimal ?? 0;

    const totalReturn = credit.transaccion.products.reduce(
      (acc, product) => {
        let productPrice = product.price;

        if (product.discount) {
          productPrice = getProductUnitPrice(product);
        }

        const returnQuantity =
          returnQuantities[product.productId]?.quantity || 0;
        const priceAdjustment =
          returnQuantities[product.productId]?.priceAdjustment ?? 0;

        const productSubtotal = returnQuantity * productPrice;
        const productTotal = productSubtotal - priceAdjustment;

        acc.subtotal += productSubtotal;
        acc.reajuste += priceAdjustment;
        acc.total += productTotal;

        return acc;
      },
      { total: 0, subtotal: 0, reajuste: 0 }
    );

    return {
      ...totalReturn,
      balanceDue: Number(currentBalanceDue) - totalReturn.total,
    };
  };

  const totalReturn = calculateTotalReturn();
  const needsExtraCash = totalReturn.total > cashRegister.cash;

  const handleReturn = () => {
    if (!cashRegister.id) {
      toast.error(NO_CASHIER_OPEN);
      return;
    }
    const formattedProducts: IProductReturn[] = [];
    for (const [key, value] of Object.entries(returnQuantities)) {
      const product = credit.transaccion.products.find(
        (p) => p.productId === key
      );
      if (!product) break;
      const newQuantity = product.quantity - value.quantity;
      if (!product.discount || newQuantity === 0) {
        formattedProducts.push({
          productId: key,
          quantity: value.quantity,
          discountApplied: false,
        });
        break;
      }
      const hasActiveDiscount = isDiscountApplied(
        credit.transaccion.sucursalId,
        value.quantity,
        product
      );
      formattedProducts.push({
        productId: key,
        quantity: value.quantity,
        discountApplied: hasActiveDiscount,
      });
    }
    const saleReturn: ITransactionReturn = {
      cajaId: cashRegister.id ?? '',
      trasaccionOrigenId: credit.transaccion.id ?? '',
      userId: userId ?? '',
      monto: needsExtraCash
        ? Number(cashRegister.cash.toFixed(2))
        : Number(totalReturn.total.toFixed(2)),
      montoExterno: needsExtraCash ? extraCash : undefined,
      products: formattedProducts,
      tipoTransaccion: credit.transaccion.tipoTransaccion,
      balanceDue: totalReturn.balanceDue,
    };
    const request = store
      .dispatch(createCreditReturn(saleReturn))
      .unwrap()
      .catch(() => {
        setReturnProccessing(false);
        return Promise.reject();
      })
      .then((res) => {
        store.dispatch(
          updateCashAmount({
            cajaId: res.caja._id ?? '',
            amount: res.caja.montoEsperado.$numberDecimal,
          })
        );
        setTimeout(() => {
          setShowModal(false);
        }, 500);
      });
    toast.promise(request, {
      loading: 'Procesando...',
      success: 'Devolución procesada exitosamente',
      error: 'Error al procesar la devolución',
    });
  };

  const paymentCredit = useMemo(() => {
    if (credit.credito?.modalidadCredito === 'PAGO') {
      if (credit.credito?.cuotasCredito!.length <= 0) return;

      return credit.credito?.cuotasCredito[
        credit.credito?.cuotasCredito.length - 1
      ];
    }
  }, [credit]);

  const installmentCredit = useMemo(() => {
    if (credit.credito?.modalidadCredito === 'PLAZO') {
      const cuotasTotales = credit.credito?.cuotasCredito.length;
      const cuotasPagadas =
        credit.credito?.cuotasCredito.filter(
          (pago) => pago.estadoPago === 'PAGADO'
        ).length ?? 0;
      const fechaSiguienteCuota = credit.credito?.cuotasCredito.find(
        (pago) => pago.estadoPago === 'PENDIENTE'
      );
      const cuotasRestantes = cuotasTotales - cuotasPagadas;
      const montoCuota =
        totalReturn.balanceDue < 0
          ? 0
          : totalReturn.balanceDue / cuotasRestantes;

      return {
        cuotasTotales,
        cuotasPagadas,
        fechaSiguienteCuota,
        cuotasRestantes,
        montoCuota,
      };
    }
  }, [credit, totalReturn.balanceDue]);

  useEffect(() => {
    if (!userCashier) {
      toast.info(NO_CASHIER_OPEN);
      return;
    }

    const cashier = userCashier as ICajaBrach;

    setCashRegister({
      id: cashier._id ?? '',
      cash: Number(cashier?.montoEsperado?.$numberDecimal ?? 0),
    });
  }, [userCashier]);

  return (
    <Card className="w-full border-0 font-onest dark:bg-gray-800">
      <CardContent>
        <div className="flex flex-col grid-cols-1 gap-4 mb-6 md:grid md:grid-cols-4">
          <div className="p-4 rounded-lg bg-primary/5">
            <h3 className="font-semibold text-gray-700 dark:text-white">
              Realizada por
            </h3>
            <p className="text-xl font-bold text-green-800 truncate dark:text-green-500">
              {credit.credito.transaccionId.usuarioId.username?.toUpperCase()}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-primary/5">
            <h3 className="font-semibold text-gray-700 dark:text-white">
              Fecha
            </h3>
            <p className="text-xl font-bold text-green-800 dark:text-green-500">
              {credit.credito.fechaVencimiento
                ? getFormatedDate(credit.credito.fechaVencimiento)
                : ''}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-primary/5">
            <h3 className="font-semibold text-gray-700 dark:text-white">
              Total de crédito
            </h3>
            <p className="text-xl font-bold text-green-800 dark:text-green-500">
              C${credit.credito.saldoCredito.$numberDecimal}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-primary/5">
            <h3 className="font-semibold text-gray-700 dark:text-white">
              Saldo pendiente
            </h3>
            <p className="text-xl font-bold text-green-800 truncate dark:text-green-500">
              C${credit.credito.saldoPendiente.$numberDecimal}
            </p>
          </div>
        </div>

        <div className="max-h-[205px] overflow-y-auto scrollbar-hide">
          <Table>
            <TableHeader>
              <TableRow className="dark:border-white">
                <TableHead className="w-[20%]">Producto</TableHead>
                <TableHead className="text-center">
                  Cantidad Procesada
                </TableHead>
                <TableHead className="text-center">
                  Cantidad Devolución
                </TableHead>
                <TableHead className="text-center">Precio Original</TableHead>
                <TableHead className="text-center">
                  Precio con descuento
                </TableHead>
                <TableHead className="text-center">Reajuste</TableHead>
                <TableHead className="text-center w-[20%]">
                  Motivo del reajuste
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {credit.transaccion.products.map((product) => (
                <TableRow key={product.productId}>
                  <TableCell className="font-medium">
                    {product.productName}
                  </TableCell>
                  <TableCell className="text-center">
                    {product.quantity}
                  </TableCell>
                  <TableCell className="flex items-center justify-center">
                    <Input
                      type="number"
                      min="0"
                      max={product.quantity}
                      value={returnQuantities[product.productId]?.quantity || 0}
                      onChange={(e) =>
                        handleQuantityChange(
                          product,
                          Number.parseInt(e.target.value) > product.quantity
                            ? product.quantity
                            : Number.parseInt(e.target.value)
                        )
                      }
                      className="w-24 text-center dark:border-white"
                      disabled={returnProccessing}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    C${product.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    {product.discount
                      ? `C$${getProductUnitPrice(product).toFixed(2)}`
                      : '---'}
                  </TableCell>
                  <TableCell className="text-center">
                    {returnQuantities[product.productId]?.priceAdjustment
                      ? `C$${returnQuantities[product.productId]?.priceAdjustment?.toFixed(2)}`
                      : '---'}
                  </TableCell>
                  <TableCell className="flex items-center justify-center gap-2 text-center">
                    {returnQuantities[product.productId]?.priceAdjustment &&
                    product.discount ? (
                      <>
                        Descuento eliminado
                        <Popover>
                          <PopoverTrigger className="p-0">
                            <BadgeInfo size={18} />
                          </PopoverTrigger>
                          <PopoverContent className="flex flex-col items-center w-auto gap-1 text-sm font-onest">
                            <span className="w-full">
                              Descuento:{' '}
                              <strong>{product.discount.name}</strong>
                            </span>
                            <div className="flex items-center gap-2">
                              {product.discount.minimiType === 'compra' ? (
                                <span>
                                  Mínimo de compra: C${' '}
                                  {product.discount.minimoCompra.$numberDecimal}
                                </span>
                              ) : (
                                <span>
                                  Mínimo de cantidad:{' '}
                                  {product.discount.minimoCantidad}
                                </span>
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </>
                    ) : (
                      '---'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-5 mt-5 md:gap-8 md:mt-20 md:flex-row">
          <Alert
            variant="default"
            className="w-full md:w-[33%] dark:bg-primary/5"
          >
            <AlertTitle className="flex items-center gap-2 font-semibold">
              <InfoIcon className="w-4 h-4 text-gray-600 dark:text-gray-100" />
              ¿Qué es un reajuste?
            </AlertTitle>
            <AlertDescription className="text-justify text-gray-600 dark:text-gray-400">
              Si debido a una devolución, un descuento aplicado originalmente
              deja de ser válido o actualiza el monto de descuento basado en el
              porcentaje, genera un reajuste en los productos restantes, lo que
              afecta tanto su precio como la cantidad a devolver. La cantidad
              final a devolver ya considera este ajuste.
            </AlertDescription>
          </Alert>

          {credit.credito.modalidadCredito === 'PAGO' ? (
            <div className="w-full md:w-[40%] p-3 rounded-lg bg-gradient-to-b from-sky-50 dark:bg-gray-300 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold text-black">
                  Actualización de crédito
                </span>
              </div>
              <div className="flex items-center justify-between text-black">
                <span>Saldo pendiente:</span>
                <span className="px-2 w-[30%] flex items-center justify-between">
                  C${' '}
                  <span>
                    {totalReturn.balanceDue <= 0
                      ? '0.00'
                      : totalReturn.balanceDue.toFixed(2)}
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-between text-black">
                <span>Monto mínimo de pago (20%):</span>
                <span className="px-2 w-[30%] flex items-center justify-between">
                  C${' '}
                  <span>
                    {totalReturn.balanceDue <= 0
                      ? '0.00'
                      : (totalReturn.balanceDue * 0.2).toFixed(2)}
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-between text-black">
                <span>Fecha próximo pago:</span>
                <span className="w-[50%] flex items-center justify-end px-2">
                  {paymentCredit
                    ? getFormatedDate(paymentCredit.fechaVencimiento)
                    : '-'}
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full md:w-[40%] p-3 rounded-lg bg-gradient-to-b from-sky-50 dark:bg-gray-300 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold text-black">
                  Actualización de crédito
                </span>
              </div>
              <div className="flex items-center justify-between text-black">
                <span>Saldo pendiente:</span>
                <span className="px-2 w-[30%] flex items-center justify-between">
                  C${' '}
                  <span>
                    {totalReturn.balanceDue <= 0
                      ? '0.00'
                      : totalReturn.balanceDue.toFixed(2)}
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-between text-black">
                <span>Fecha próximo pago:</span>
                <span className="w-[50%] flex items-center justify-end px-2">
                  {installmentCredit?.fechaSiguienteCuota?.fechaVencimiento
                    ? getFormatedDate(
                        installmentCredit?.fechaSiguienteCuota.fechaVencimiento
                      )
                    : '-'}
                </span>
              </div>
              <div className="flex items-center justify-between text-black">
                <span>Cuotas restantes:</span>
                <span className="w-[50%] flex items-center justify-end px-2">
                  {totalReturn.balanceDue <= 0
                    ? '-'
                    : installmentCredit?.cuotasRestantes}
                </span>
              </div>
              <div className="flex items-center justify-between text-black">
                <span>Monto de cuota:</span>
                <span className="w-[50%] flex items-center justify-end px-2">
                  {installmentCredit?.montoCuota.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <div className="w-full md:w-[26%] p-3 rounded-lg bg-sky-50 dark:bg-gray-300 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-semibold text-blue-800">
                Resumen de la devolución
              </span>
            </div>
            <div className="flex items-center justify-between text-blue-800">
              <span>Subtotal:</span>
              <span className="px-2 w-[30%] flex items-center justify-between">
                C$ <span>{totalReturn.subtotal.toFixed(2)}</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-blue-800">
              <span>Reajuste:</span>
              <span className="px-2 w-[30%] flex items-center justify-between">
                C$ <span>-{totalReturn.reajuste.toFixed(2)}</span>
              </span>
            </div>
            <div className="flex items-center justify-between mt-2 text-blue-800">
              <span>Total:</span>
              <span className="px-2 flex items-center justify-between border-t border-blue-900 w-[30%]">
                C$
                <span>{totalReturn.total.toFixed(2)}</span>
              </span>
            </div>
          </div>
        </div>

        {needsExtraCash && (
          <div className="flex items-center justify-center w-full">
            <Alert
              variant="destructive"
              className="flex flex-col w-full mt-4 md:flex-row dark:bg-gray-200 dark:border-red-500"
            >
              <div className="w-full md:w-[80%]">
                <AlertTitle className="flex items-center gap-2 dark:text-red-500">
                  <AlertTriangleIcon className="w-4 h-4" />
                  Advertencia
                </AlertTitle>
                <AlertDescription className="w-full md:w-[90%] dark:text-red-500">
                  No hay suficiente dinero en caja para cubrir la devolución. Se
                  necesitan{' '}
                  <span className="font-bold">
                    ${(totalReturn.total - cashRegister.cash).toFixed(2)}{' '}
                  </span>
                  adicionales, proceda a ingresar el dinero adicional antes de
                  continuar.
                </AlertDescription>
              </div>
              <div className="mt-3 md:mt-0">
                <Label
                  htmlFor="extraCash"
                  className="font-semibold dark:text-red-500"
                >
                  Ingrese dinero extra:
                </Label>
                <div className="flex items-center mt-2">
                  <Input
                    id="extraCash"
                    type="number"
                    min={0}
                    max={Number(
                      (totalReturn.total - cashRegister.cash).toFixed(2)
                    )}
                    value={extraCash}
                    onChange={(e) => {
                      if (e.target.value === '') return setExtraCash(0);

                      const cashNeeded = Number(
                        (totalReturn.total - cashRegister.cash).toFixed(2)
                      );

                      if (needsExtraCash && Number(e.target.value) > cashNeeded)
                        return setExtraCash(cashNeeded);

                      setExtraCash(Number.parseFloat(e.target.value));
                    }}
                    className="w-full mr-2 text-black md:w-40"
                    disabled={returnProccessing}
                  />
                </div>
              </div>
            </Alert>
          </div>
        )}

        <div className="flex justify-end mt-8">
          <Button
            onClick={handleReturn}
            className="w-full px-8 py-5 font-semibold uppercase md:w-auto disabled:bg-gray-200 dark:disabled:bg-gray-900 disabled:cursor-not-allowed disabled:text-gray-800 dark:disabled:text-gray-200 dark:bg-white"
            disabled={
              totalReturn.total === 0 ||
              cashRegister.cash + extraCash < totalReturn.total ||
              returnProccessing
            }
          >
            <CheckCircleIcon className="w-5 h-5 mr-2" />
            Procesar
          </Button>
        </div>
      </CardContent>
      <Toaster richColors />
    </Card>
  );
}
