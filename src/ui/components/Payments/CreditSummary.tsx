import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ICredit, ICuotasCredito } from '../../../interfaces/creditsInterfaces';
import { getFormatedDate } from '../../../shared/helpers/transferHelper';
import { esFechaMayor } from '../../../shared/helpers/salesHelper';
import { useMemo } from 'react';

interface CreditSummaryProps {
  creditSelected: ICredit | null;
}

export function CreditSummary({ creditSelected }: CreditSummaryProps) {
  const fechaSiguienteCuota = creditSelected?.cuotasCredito.find(
    (pago) => pago.estadoPago === 'PENDIENTE'
  );

  const currentDate = new Date();
  const fechaCuotaVencida = esFechaMayor(
    currentDate,
    new Date(fechaSiguienteCuota?.fechaVencimiento ?? currentDate)
  );

  const cuotasPagadas =
    creditSelected?.cuotasCredito.filter((pago) => pago.estadoPago === 'PAGADO')
      .length ?? 0;

  const saldoPendiente = Number(
    creditSelected?.saldoPendiente.$numberDecimal ?? 0
  );

  const isDeadlineCredit = creditSelected?.modalidadCredito === 'PLAZO';

  const creditoPagado =
    Number(creditSelected?.saldoPendiente.$numberDecimal) === 0;

  return (
    <Card
      className={`${isDeadlineCredit && fechaCuotaVencida ? 'border-red-500 shadow-red-300 shadow-sm animate-flash' : creditoPagado ? 'border-green-500' : ''} w-2/4`}
    >
      <CardHeader>
        <CardTitle className="font-onest">
          {creditSelected?.modalidadCredito === 'PAGO'
            ? 'Resumen de Abono'
            : 'Resumen de Crédito'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {creditSelected?.modalidadCredito === 'PAGO' ? (
            <PaymentCreditSummary
              creditSelected={creditSelected}
              creditoPagado={creditoPagado}
            />
          ) : (
            <DeadlineCreditSummary
              creditSelected={creditSelected}
              fechaSiguienteCuota={fechaSiguienteCuota}
              fechaCuotaVencida={fechaCuotaVencida}
              creditoPagado={creditoPagado}
              saldoPendiente={saldoPendiente}
              cuotasPagadas={cuotasPagadas}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export interface IPaymentCreditSummaryProps {
  creditoPagado: boolean;
}

const PaymentCreditSummary = ({
  creditSelected,
  creditoPagado,
}: CreditSummaryProps & IPaymentCreditSummaryProps) => {
  const ultimaCuota = useMemo(() => {
    if (creditSelected!.cuotasCredito!.length <= 0) return null;

    return creditSelected!.cuotasCredito[
      creditSelected!.cuotasCredito.length - 1
    ];
  }, [creditSelected]);

  return (
    <>
      <p className="flex items-center gap-2 font-onest">
        <strong className="font-onest">Total de deuda:</strong>
        <span>${creditSelected?.saldoCredito.$numberDecimal ?? 0}</span>
      </p>
      <p className="flex items-center gap-2 font-onest">
        <strong className="font-onest">Saldo pendiente:</strong>
        <span>${creditSelected?.saldoPendiente.$numberDecimal ?? 0}</span>
      </p>
      <p className="flex items-center gap-2 font-onest">
        <strong className="font-onest">Próximo pago:</strong>
        <span>
          {creditoPagado
            ? '-'
            : getFormatedDate(ultimaCuota?.fechaVencimiento ?? new Date())}
        </span>
      </p>
      <p className="flex items-center gap-2 font-onest">
        <strong className="font-onest">Monto mínimo de abono (20%):</strong>
        <span>
          $
          {creditoPagado
            ? 0
            : (creditSelected?.pagoMinimoMensual.$numberDecimal ?? 0)}
        </span>
      </p>
    </>
  );
};

export interface IDeadlineCreditSummary {
  fechaSiguienteCuota: ICuotasCredito | undefined;
  fechaCuotaVencida: boolean;
  creditoPagado: boolean;
  saldoPendiente: number;
  cuotasPagadas: number;
}

const DeadlineCreditSummary = ({
  creditSelected,
  fechaSiguienteCuota,
  fechaCuotaVencida,
  creditoPagado,
  saldoPendiente,
  cuotasPagadas,
}: CreditSummaryProps & IDeadlineCreditSummary) => {
  return (
    <>
      <p className="flex items-center gap-2 font-onest">
        <strong className="font-onest">Monto total del crédito:</strong>
        <span>${creditSelected?.saldoCredito.$numberDecimal ?? 0}</span>
      </p>
      <p className="flex items-center gap-2 font-onest">
        <strong className="font-onest">Cuotas totales:</strong>{' '}
        {creditSelected?.cuotasCredito.length ?? 0}
      </p>
      <p className="flex items-center gap-2 font-onest">
        <strong className="font-onest">Cuotas pagadas:</strong> {cuotasPagadas}
      </p>
      <p className="flex items-center gap-2 font-onest">
        <strong className="font-onest">Saldo pendiente:</strong>
        <span>${creditoPagado ? 0 : saldoPendiente}</span>
      </p>
      <p className="flex items-center gap-2">
        <strong className="font-onest">Próximo pago:</strong>
        <span className="font-onest">
          {creditoPagado
            ? '-'
            : getFormatedDate(fechaSiguienteCuota?.fechaVencimiento!)}
        </span>
      </p>
      <p className="flex items-center gap-2 font-onest">
        <strong className="font-onest">Monto de cuota:</strong>
        <span>
          $
          {creditoPagado
            ? 0
            : (creditSelected?.cuotaMensual.$numberDecimal ?? 0)}
        </span>
      </p>
      <p className="flex items-center gap-2 font-onest">
        <strong className="font-onest">Estado de cuota:</strong>
        <span
          className={`font-onest ${fechaCuotaVencida ? 'text-red-600 font-bold' : creditoPagado ? 'text-green-600 font-bold' : ''}`}
        >
          {creditoPagado
            ? 'Pagado'
            : fechaCuotaVencida
              ? 'Atrasado'
              : 'Pendiente'}
        </span>
      </p>
    </>
  );
};
