'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
import { ICredit } from '../../../interfaces/creditsInterfaces';
import './styles.scss';

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
    <Card className="pt-[10px]">
      <CardHeader className="py-2">
        <CardTitle className="font-onest">Progreso del Pago</CardTitle>
      </CardHeader>
      <CardContent className="pb-[10px]">
        <Progress
          value={progress}
          className={`progress__bar ${progress === 100 ? 'complete' : 'incomplete'}`}
        />
        <p className="mt-2 text-sm text-left font-onest">
          Se ha pagado el {progress}% de la deuda total
        </p>
      </CardContent>
    </Card>
  );
}
