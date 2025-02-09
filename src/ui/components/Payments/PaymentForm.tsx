import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  ICredit,
  IPostPagoCredito,
} from '../../../interfaces/creditsInterfaces';
import { useEffect, useState } from 'react';
import { PaymentProgress } from './PaymentProgress';
import { store } from '../../../app/store';
import { payCredit } from '../../../app/slices/credits';
import { toast, Toaster } from 'sonner';
import { Banknote } from 'lucide-react';
import { useRoleAccess } from '../../../shared/hooks/useRoleAccess';
import { PAGES_MODULES } from '../../../shared/helpers/roleHelper';
import { useAppSelector } from '../../../app/hooks';
import { updateCashAmount } from '../../../app/slices/cashRegisterSlice';

interface PaymentFormProps {
  creditSelected: ICredit | null;
}

export function PaymentForm({ creditSelected }: PaymentFormProps) {
  const access = useRoleAccess(PAGES_MODULES.CREDITOS);

  const user = store.getState().auth.signIn.user;
  const caja = useAppSelector((state) => state.boxes.BoxesData);
  const userCashierList = caja?.filter((c) => {
    const usuarioId =
      typeof c.usuarioAperturaId === 'string'
        ? c.usuarioAperturaId
        : c.usuarioAperturaId?._id;

    return usuarioId === user?._id && c.estado?.toUpperCase() === 'ABIERTA';
  });
  const userCashier =
    userCashierList && userCashierList.length > 0 ? userCashierList[0] : null;

  const [amount, setAmount] = useState<number>(0.0);
  const [processingSale, setProcessingSale] = useState(false);

  const creditoPagado = creditSelected?.estadoCredito === 'CERRADO';

  const handleSubmit = () => {
    if (!userCashier) {
      toast.error('Debe abrir una caja para procesar la venta.');
      return;
    }

    setProcessingSale(true);
    const data: IPostPagoCredito = {
      creditoIdStr: creditSelected?._id ?? '',
      montoPago: amount,
      modalidadCredito: creditSelected?.modalidadCredito ?? 'PLAZO',
      cajaId: userCashier._id,
    };

    const request = store
      .dispatch(payCredit(data))
      .unwrap()
      .catch(() => {
        setProcessingSale(false);
        return Promise.reject();
      })
      .then(() => {
        store.dispatch(
          updateCashAmount({
            cajaId: userCashier._id ?? '',
            amount: Number(userCashier.montoEsperado.$numberDecimal) + amount,
          })
        );

        setTimeout(() => {
          setProcessingSale(false);
        }, 500);
      });

    toast.promise(request, {
      loading: 'Procesando...',
      success: 'Abonado exitosamente',
      error: 'Error al procesar el pago',
    });
  };

  const getValidAmount = (amount: string) => {
    const amountNumber = Number(amount);

    if (!creditSelected) {
      toast.info('Debe seleccionar un crédito');
      return amountNumber;
    }

    if (creditSelected?.modalidadCredito === 'PLAZO') {
      toast.info('Crédito a plazos sólo soporta cuota fija');
      return Number(creditSelected.cuotaMensual.$numberDecimal);
    }

    if (amountNumber < creditSelected!.pagoMinimoMensual.$numberDecimal) {
      toast.info(
        `El pago mínimo es de $${Number(creditSelected!.pagoMinimoMensual.$numberDecimal)}`
      );
      return Number(creditSelected!.pagoMinimoMensual.$numberDecimal);
    }

    if (amountNumber > creditSelected!.saldoPendiente.$numberDecimal) {
      toast.info(
        `El pago máximo es de $${Number(creditSelected!.saldoPendiente.$numberDecimal)}`
      );
      return Number(creditSelected!.saldoPendiente.$numberDecimal);
    }

    return amountNumber;
  };

  useEffect(() => {
    if (!creditSelected) return;

    setAmount(
      Number(
        creditSelected!.modalidadCredito === 'PLAZO'
          ? creditSelected!.cuotaMensual.$numberDecimal
          : creditSelected!.pagoMinimoMensual.$numberDecimal
      )
    );
  }, [creditSelected]);

  return (
    <>
      <div className="flex flex-col justify-between w-2/4 gap-[14px]">
        {creditSelected?.modalidadCredito === 'PLAZO' && (
          <PaymentProgress creditSelected={creditSelected} />
        )}
        {access.update && (
          <Card className="w-full h-full">
            <CardHeader>
              <CardTitle className="font-onest">
                {creditSelected?.modalidadCredito === 'PAGO'
                  ? 'Realizar Abono'
                  : 'Realizar Pago de Cuota'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="relative space-y-2">
                  <Banknote className="absolute text-green-600 transform -translate-y-1/2 left-2 top-1/2" />
                  <Input
                    className="pl-10 font-onest"
                    id="amount"
                    type="number"
                    placeholder={'0.00'}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    onBlur={(e) => setAmount(getValidAmount(e.target.value))}
                    disabled={processingSale || creditoPagado}
                    min={0}
                    max={creditSelected?.saldoPendiente.$numberDecimal}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full font-onest hover:disabled:cursor-not-allowed"
                  onClick={handleSubmit}
                  disabled={processingSale || amount <= 0 || creditoPagado}
                >
                  {creditSelected?.modalidadCredito === 'PAGO'
                    ? 'Abonar'
                    : 'Pagar Cuota'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
      <Toaster richColors />
    </>
  );
}
