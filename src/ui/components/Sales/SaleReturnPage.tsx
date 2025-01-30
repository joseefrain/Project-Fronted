'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertTriangleIcon, CheckCircleIcon } from 'lucide-react';
import {
  IProductReturn,
  IProductSale,
  ISale,
  ITransactionReturn,
} from '../../../interfaces/salesInterfaces';
import { getFormatedDate } from '../../../shared/helpers/transferHelper';
import { useAppSelector } from '../../../app/hooks';
import { toast, Toaster } from 'sonner';
import {
  isDiscountApplied,
  NO_CASHIER_OPEN,
} from '../../../shared/helpers/salesHelper';
import { ICajaBrach } from '../../../app/slices/cashRegisterSlice';
import { store } from '../../../app/store';
import { createSaleReturn } from '../../../app/slices/salesSlice';

export default function SalesReturnPage({
  saleDetails,
  setShowModal,
}: {
  saleDetails: ISale;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const userId = useAppSelector((state) => state.auth.signIn.user?._id);
  const cashOpen = useAppSelector((state) => state.auth.signIn.cajaId);

  const [returnProccessing, setReturnProccessing] = useState(false);
  const [returnQuantities, setReturnQuantities] = useState<{
    [key: string]: number;
  }>({});
  const [cashRegister, setCashRegister] = useState<{
    id: string | null;
    cash: number;
  }>({
    id: null,
    cash: 0,
  });
  const [extraCash, setExtraCash] = useState(0);

  const handleQuantityChange = (productId: string, quantity: number) => {
    setReturnQuantities((prev) => ({
      ...prev,
      [productId]: Math.min(
        quantity,
        saleDetails.products.find((p) => p.productId === productId)?.quantity ||
          0
      ),
    }));
  };

  const calculateTotalReturn = () => {
    return saleDetails.products.reduce((total, product) => {
      let productPrice = product.price;

      if (product.discount) {
        productPrice = getProductUnitPrice(product);
      }

      const returnQuantity = returnQuantities[product.productId] || 0;
      return total + returnQuantity * productPrice;
    }, 0);
  };

  const getProductUnitPrice = (product: IProductSale) => {
    if (!product.discount) return product.price;

    const productTotalSale =
      product.quantity * product.price - product.discount.amount;
    const productPriceWithDiscount = productTotalSale / product.quantity;

    return productPriceWithDiscount;
  };

  const totalReturn = calculateTotalReturn();
  const needsExtraCash = totalReturn > cashRegister.cash;

  const handleReturn = () => {
    if (!cashRegister.id) {
      toast.error(NO_CASHIER_OPEN);
      return;
    }

    const formattedProducts: IProductReturn[] = [];
    for (const [key, value] of Object.entries(returnQuantities)) {
      const product = saleDetails.products.find((p) => p.productId === key);
      if (!product) return;

      const newQuantity = product.quantity - value;

      if (!product.discount || newQuantity === 0) {
        formattedProducts.push({
          productId: key,
          quantity: value,
          discountApplied: false,
        });
        return;
      }

      const hasActiveDiscount = isDiscountApplied(
        saleDetails.sucursalId,
        value,
        product
      );

      if (hasActiveDiscount)
        return formattedProducts.push({
          productId: key,
          quantity: value,
          discountApplied: hasActiveDiscount,
        });

      // REAJUSTE PARA DESCUENTOS POR CANTIDAD

      const unityPriceWithDiscount = getProductUnitPrice(product);
      const unityPrice = product.price;

      const newSubtotalWithDiscount = newQuantity * unityPriceWithDiscount;
      const newSubtotalWithOutDiscount = newQuantity * unityPrice;

      const discountAmount =
        newSubtotalWithOutDiscount - newSubtotalWithDiscount;

      console.log(discountAmount, 'REAJUSTE');

      formattedProducts.push({
        productId: key,
        quantity: value,
        discountApplied: hasActiveDiscount,
      });
    }

    const saleReturn: ITransactionReturn = {
      cajaId: cashRegister.id ?? '',
      trasaccionOrigenId: saleDetails.id ?? '',
      userId: userId ?? '',
      monto: needsExtraCash ? cashRegister.cash : totalReturn,
      montoExterno: needsExtraCash ? extraCash : undefined,
      products: formattedProducts,
    };

    const request = store
      .dispatch(createSaleReturn(saleReturn))
      .unwrap()
      .catch(() => {
        setReturnProccessing(false);
        return Promise.reject();
      })
      .then(() => {
        setTimeout(() => {
          setShowModal(false);
        }, 500);
      });

    toast.promise(request, {
      loading: 'Procesando...',
      success: 'Devolución procesada exitosamente',
      error: 'Error al procesar la devolución',
    });

    console.log(saleReturn);
    console.log(saleDetails);
  };

  useEffect(() => {
    if (!cashOpen) {
      toast.info(NO_CASHIER_OPEN);
      return;
    }

    const cashier = cashOpen as ICajaBrach;

    setCashRegister({
      id: cashier._id ?? '',
      cash: Number(cashier?.montoEsperado?.$numberDecimal ?? 0),
    });
  }, [cashOpen]);

  return (
    <Card className="w-full border-0 font-onest">
      <CardContent>
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
          <div className="p-4 rounded-lg bg-primary/5">
            <h3 className="font-semibold text-gray-700">Realizada por</h3>
            <p className="text-xl font-bold text-green-800 truncate">
              {saleDetails.userId.toUpperCase()}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-primary/5">
            <h3 className="font-semibold text-gray-700">Fecha</h3>
            <p className="text-xl font-bold text-green-800">
              {saleDetails.fechaRegistro
                ? getFormatedDate(saleDetails.fechaRegistro)
                : ''}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-primary/5">
            <h3 className="font-semibold text-gray-700">
              Total de la transacción
            </h3>
            <p className="text-xl font-bold text-green-800">
              ${saleDetails.total}
            </p>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="max-h-[205px] overflow-y-auto scrollbar-hide">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Producto</TableHead>
                <TableHead className="text-center">
                  Cantidad Procesada
                </TableHead>
                <TableHead className="text-center">Precio Unitario</TableHead>
                <TableHead className="text-center">
                  Precio Unitario Con Descuento
                </TableHead>
                <TableHead className="text-center">
                  Cantidad a Devolver
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {saleDetails.products.map((product) => (
                <TableRow key={product.productId}>
                  <TableCell className="font-medium">
                    {product.productName}
                  </TableCell>
                  <TableCell className="text-center">
                    {product.quantity}
                  </TableCell>
                  <TableCell className="text-center">
                    ${product.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    {product.discount
                      ? `$${getProductUnitPrice(product)}`
                      : '-'}
                  </TableCell>
                  <TableCell className="flex items-center justify-center">
                    <Input
                      type="number"
                      min="0"
                      max={product.quantity}
                      value={returnQuantities[product.productId] || 0}
                      onChange={(e) =>
                        handleQuantityChange(
                          product.productId,
                          Number.parseInt(e.target.value)
                        )
                      }
                      className="w-24 text-center"
                      disabled={returnProccessing}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="p-4 mt-6 rounded-lg bg-sky-100">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-blue-800">
              Total a devolver:
            </span>
            <span className="text-2xl font-bold text-blue-800">
              ${totalReturn.toFixed(2)}
            </span>
          </div>
          <div className="mt-2 text-sm text-blue-800">
            Dinero en caja: ${cashRegister.cash.toFixed(2)}
          </div>
        </div>

        {needsExtraCash && (
          <div className="flex items-center justify-center w-full">
            <Alert variant="destructive" className="flex w-full mt-4">
              <div className="w-[80%]">
                <AlertTitle className="flex items-center gap-2">
                  <AlertTriangleIcon className="w-4 h-4" />
                  Advertencia
                </AlertTitle>
                <AlertDescription className="w-[90%]">
                  No hay suficiente dinero en caja para cubrir la devolución. Se
                  necesitan{' '}
                  <span className="font-bold">
                    ${(totalReturn - cashRegister.cash).toFixed(2)}{' '}
                  </span>
                  adicionales, proceda a ingresar el dinero adicional antes de
                  continuar.
                </AlertDescription>
              </div>
              <div>
                <Label htmlFor="extraCash" className="font-semibold">
                  Ingrese dinero extra:
                </Label>
                <div className="flex items-center mt-2">
                  <Input
                    id="extraCash"
                    type="number"
                    min={0}
                    max={Number((totalReturn - cashRegister.cash).toFixed(2))}
                    value={extraCash}
                    onChange={(e) => {
                      if (e.target.value === '') return setExtraCash(0);

                      const cashNeeded = Number(
                        (totalReturn - cashRegister.cash).toFixed(2)
                      );

                      if (needsExtraCash && Number(e.target.value) > cashNeeded)
                        return setExtraCash(cashNeeded);

                      setExtraCash(Number.parseFloat(e.target.value));
                    }}
                    className="w-40 mr-2 text-black"
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
            className="px-8 py-5 font-semibold uppercase disabled:bg-gray-200 disabled:cursor-not-allowed"
            disabled={
              totalReturn === 0 ||
              cashRegister.cash + extraCash < totalReturn ||
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
