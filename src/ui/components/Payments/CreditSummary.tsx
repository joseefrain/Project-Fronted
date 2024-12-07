import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CreditSummaryProps {
  paymentType: 'abono' | 'credito';
}

export function CreditSummary({ paymentType }: CreditSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {paymentType === 'abono' ? 'Resumen de Abono' : 'Resumen de Crédito'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {paymentType === 'abono' ? (
            <>
              <p>
                <strong>Total de deuda:</strong> $10,000
              </p>
              <p>
                <strong>Próximo pago:</strong> 15/07/2023
              </p>
              <p>
                <strong>Monto mínimo de abono:</strong> $100
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>Monto total del crédito:</strong> $10,000
              </p>
              <p>
                <strong>Cuotas totales:</strong> 24
              </p>
              <p>
                <strong>Cuotas pagadas:</strong> 12
              </p>
              <p>
                <strong>Saldo pendiente:</strong> $6,000
              </p>
              <p>
                <strong>Próximo pago:</strong> 15/07/2023
              </p>
              <p>
                <strong>Monto de cuota:</strong> $500
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
