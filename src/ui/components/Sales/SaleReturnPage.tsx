'use client';

import { useEffect, useState } from 'react';
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
  ISale,
  ITransactionReturn,
} from '../../../interfaces/salesInterfaces';
import { getFormatedDate } from '../../../shared/helpers/transferHelper';
import { useAppSelector } from '../../../app/hooks';
import { toast, Toaster } from 'sonner';
import { NO_CASHIER_OPEN } from '../../../shared/helpers/salesHelper';

export default function SalesReturnPage({
  saleDetails,
}: {
  saleDetails: ISale;
}) {
  const userId = useAppSelector((state) => state.auth.signIn.user?._id);
  const cashOpen = useAppSelector((state) => state.boxes.boxState);

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
      const returnQuantity = returnQuantities[product.productId] || 0;
      return total + returnQuantity * product.price;
    }, 0);
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
      formattedProducts.push({
        productId: key,
        quantity: value,
        newUnityPrice: null,
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

    console.log(saleReturn);
    console.log(saleDetails);
  };

  useEffect(() => {
    if (!cashOpen || cashOpen.length === 0) {
      toast.info(NO_CASHIER_OPEN);
      return;
    }

    const cashier = cashOpen[0];
    setCashRegister({
      id: cashier?._id ?? '',
      cash: Number(cashier?.montoEsperado?.$numberDecimal ?? 0),
    });
  }, [cashOpen]);

  return (
    <Card className="w-full border-0 font-onest">
      <CardContent>
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
          <div className="p-4 rounded-lg bg-primary/5">
            <h3 className="font-semibold text-gray-700">Realizada por</h3>
            <p className="text-xl font-bold text-green-700">
              {saleDetails.userId.toUpperCase()}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-primary/5">
            <h3 className="font-semibold text-gray-700">Fecha</h3>
            <p className="text-xl font-bold text-green-700">
              {saleDetails.fechaRegistro
                ? getFormatedDate(saleDetails.fechaRegistro)
                : ''}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-primary/5">
            <h3 className="font-semibold text-gray-700">
              Total de la transacción
            </h3>
            <p className="text-xl font-bold text-green-700">
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
                    value={extraCash}
                    onChange={(e) =>
                      e.target.value === ''
                        ? setExtraCash(0)
                        : setExtraCash(Number.parseFloat(e.target.value))
                    }
                    className="w-40 mr-2 text-black"
                  />
                </div>
              </div>
            </Alert>
          </div>
        )}

        <div className="flex justify-end mt-8">
          <Button
            onClick={handleReturn}
            className="px-8 py-5 font-semibold text-green-800 uppercase bg-green-100 hover:bg-green-200 disabled:bg-gray-200 disabled:cursor-not-allowed"
            disabled={
              totalReturn === 0 || cashRegister.cash + extraCash < totalReturn
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
