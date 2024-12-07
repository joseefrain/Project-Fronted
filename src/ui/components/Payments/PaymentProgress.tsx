'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
import { ICredit } from '../../../interfaces/creditsInterfaces';

export interface IPaymentProgressProps {
  creditSelected: ICredit | null;
}

export function PaymentProgress({ creditSelected }: IPaymentProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const saldoCredito = creditSelected?.saldoCredito.$numberDecimal ?? 0;
    const saldoPendiente = creditSelected?.saldoPendiente.$numberDecimal ?? 0;

    const progress = Math.round(
      ((saldoCredito - saldoPendiente) / saldoCredito) * 100
    );

    const timer = setTimeout(() => setProgress(progress), 500);
    return () => clearTimeout(timer);
  }, [creditSelected]);

  return (
    <Card className="pt-4">
      <CardHeader className="py-2">
        <CardTitle className="font-onest">Progreso del Pago</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="w-full" />
        <p className="mt-2 text-sm text-left font-onest">
          Has pagado el {progress}% de tu deuda total
        </p>
      </CardContent>
    </Card>
  );
}
