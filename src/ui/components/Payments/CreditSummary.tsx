import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ICredit, ICuotasCredito } from '../../../interfaces/creditsInterfaces';
import { getFormatedDate } from '../../../shared/helpers/transferHelper';
import { esFechaMayor } from '../../../shared/helpers/salesHelper';

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

  return (
    <Card
      className={`${creditSelected?.modalidadCredito === 'PLAZO' && fechaCuotaVencida ? 'border-red-500 shadow-red-300 shadow-sm animate-flash' : ''} w-2/4`}
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
            <PaymentCreditSummary creditSelected={creditSelected} />
          ) : (
            <DeadlineCreditSummary
              creditSelected={creditSelected}
              fechaSiguienteCuota={fechaSiguienteCuota}
              fechaCuotaVencida={fechaCuotaVencida}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const PaymentCreditSummary = ({ creditSelected }: CreditSummaryProps) => {
  return (
    <>
      <p className="flex items-center gap-2 font-onest">
        <strong className="font-onest">Total de deuda:</strong>
        <span>${creditSelected?.saldoCredito.$numberDecimal ?? 0}</span>
      </p>
      <p className="flex items-center gap-2 font-onest">
        <strong className="font-onest">Próximo pago:</strong>
        <span>{new Date().toDateString()}</span>
      </p>
      <p className="flex items-center gap-2 font-onest">
        <strong className="font-onest">Monto mínimo de abono:</strong>
        <span>${creditSelected?.pagoMinimoMensual.$numberDecimal ?? 0}</span>
      </p>
    </>
  );
};

export interface IDeadlineCreditSummary {
  fechaSiguienteCuota: ICuotasCredito | undefined;
  fechaCuotaVencida: boolean;
}

const DeadlineCreditSummary = ({
  creditSelected,
  fechaSiguienteCuota,
  fechaCuotaVencida,
}: CreditSummaryProps & IDeadlineCreditSummary) => {
  const cuotasPagadas =
    creditSelected?.cuotasCredito.filter((pago) => pago.estadoPago === 'PAGADO')
      .length ?? 0;

  const dineroPagado =
    creditSelected?.cuotasCredito
      .filter((pago) => pago.estadoPago === 'PAGADO')
      .reduce((acum, pago) => acum + pago.montoCuota.$numberDecimal, 0) ?? 0;

  const saldoPendiente =
    (creditSelected?.saldoCredito.$numberDecimal ?? 0) - dineroPagado;

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
        <span>${saldoPendiente}</span>
      </p>
      <p className="flex items-center gap-2">
        <strong className="font-onest">Próximo pago:</strong>
        <span className="font-onest">
          {getFormatedDate(fechaSiguienteCuota?.fechaVencimiento!)}
        </span>
      </p>
      <p className="flex items-center gap-2 font-onest">
        <strong className="font-onest">Monto de cuota:</strong>
        <span>${creditSelected?.cuotaMensual.$numberDecimal ?? 0}</span>
      </p>
      <p className="flex items-center gap-2 font-onest">
        <strong className="font-onest">Estado de cuota:</strong>
        <span
          className={`font-onest ${fechaCuotaVencida ? 'text-red-600 font-bold' : ''}`}
        >
          {fechaCuotaVencida ? 'Atrasado' : 'Pendiente'}
        </span>
      </p>
    </>
  );
};
