import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  ICredit,
  IPostPagoCredito,
} from '../../../interfaces/creditsInterfaces';
import { useState } from 'react';
import { PaymentProgress } from './PaymentProgress';
import { store } from '../../../app/store';
import { payCredit } from '../../../app/slices/credits';
import { toast, Toaster } from 'sonner';

interface PaymentFormProps {
  creditSelected: ICredit | null;
}

export function PaymentForm({ creditSelected }: PaymentFormProps) {
  const [amount, setAmount] = useState<number>(0);
  const [processingSale, setProcessingSale] = useState(false);

  const handleSubmit = () => {
    const data: IPostPagoCredito = {
      creditoIdStr: creditSelected?._id ?? '',
      montoPago: amount,
      modalidadCredito: creditSelected?.modalidadCredito ?? 'PLAZO',
    };

    const request = store
      .dispatch(payCredit(data))
      .unwrap()
      .catch(() => {
        setProcessingSale(false);
        return Promise.reject();
      })
      .then(() => {
        setTimeout(() => {
          setProcessingSale(false);
          setAmount(0);
        }, 500);
      });

    toast.promise(request, {
      loading: 'Procesando...',
      success: 'Abonado exitosamente',
      error: 'Error al procesar el pago',
    });
  };

  return (
    <>
      <div className="flex flex-col justify-between w-2/4">
        {creditSelected?.modalidadCredito === 'PLAZO' && (
          <PaymentProgress creditSelected={creditSelected} />
        )}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="font-onest">
              {creditSelected?.modalidadCredito === 'PAGO'
                ? 'Realizar Abono'
                : 'Realizar Pago de Cuota'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <Input
                  className="font-onest"
                  id="amount"
                  type="number"
                  placeholder={
                    creditSelected?.modalidadCredito === 'PAGO'
                      ? 'Ingrese el monto del abono'
                      : 'Ingrese el monto de la cuota'
                  }
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  disabled={processingSale}
                />
              </div>
              <Button
                type="submit"
                className="w-full font-onest"
                onClick={handleSubmit}
                disabled={processingSale}
              >
                {creditSelected?.modalidadCredito === 'PAGO'
                  ? 'Abonar'
                  : 'Pagar Cuota'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Toaster richColors />
    </>
  );
}
