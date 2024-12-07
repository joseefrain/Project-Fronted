import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function PendingPaymentsSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-onest">
          Resumen de Cuotas Pendientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="font-onest">
            <strong className="font-onest">Cuotas pendientes:</strong> 12
          </p>
          <p className="font-onest">
            <strong className="font-onest">Monto total pendiente:</strong>
            $6,000
          </p>
          <p className="font-onest">
            <strong className="font-onest">Monto total pendiente:</strong>
            <strong className="font-onest">Próxima cuota:</strong> 15/07/2023 -
            $500
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
