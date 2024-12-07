'use client';

import { CreditSummary } from './CreditSummary';
import { PaymentForm } from './PaymentForm';
import { PaymentProgress } from './PaymentProgress';
import { PaymentHistory } from './PaymentHistory';
import { useAppSelector } from '../../../app/hooks';
import './styles.scss';

export const CreditPaymentSystem = () => {
  const creditSelected = useAppSelector(
    (state) => state.credits.creditSelected
  );

  return (
    <div className="container h-auto mx-auto space-y-6 max-h-[75vh]">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-800 mb-9 font-onest">
          Gestión de crédito
        </h1>
      </div>
      <div className="card__header">
        {creditSelected?.modalidadCredito === 'PAGO' && (
          <PaymentProgress creditSelected={creditSelected} />
        )}
        <div className="flex w-full gap-4">
          <CreditSummary creditSelected={creditSelected} />
          <PaymentForm creditSelected={creditSelected} />
        </div>
      </div>
      <PaymentHistory />
    </div>
  );
};
