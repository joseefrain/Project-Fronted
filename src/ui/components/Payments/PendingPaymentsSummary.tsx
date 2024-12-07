import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function PendingPaymentsSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen de Cuotas Pendientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            <strong>Cuotas pendientes:</strong> 12
          </p>
          <p>
            <strong>Monto total pendiente:</strong> $6,000
          </p>
          <p>
            <strong>Próxima cuota:</strong> 15/07/2023 - $500
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
