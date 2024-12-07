'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreditSummary } from './CreditSummary';
import { PaymentForm } from './PaymentForm';
import { PaymentProgress } from './PaymentProgress';
import { PaymentHistory } from './PaymentHistory';

export const CreditPaymentSystem = () => {
  const [paymentType, setPaymentType] = useState<'abono' | 'credito'>('abono');

  return (
    <div className="container mx-auto p-4 space-y-6 ">
      <h1 className="text-3xl font-bold text-center mb-6">
        Sistema de Pago de Crédito
      </h1>
      <div className="w-full max-w-xs mx-auto">
        <Select
          onValueChange={(value: 'abono' | 'credito') => setPaymentType(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar tipo de pago" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="abono">Abono</SelectItem>
            <SelectItem value="credito">Crédito de pago</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CreditSummary paymentType={paymentType} />
        <PaymentForm paymentType={paymentType} />
      </div>
      <PaymentProgress />
      <PaymentHistory />
    </div>
  );
};
