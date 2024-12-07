'use client';

import { CreditSummary } from './CreditSummary';
import { PaymentForm } from './PaymentForm';
import { PaymentProgress } from './PaymentProgress';
import { PaymentHistory } from './PaymentHistory';
import { useAppSelector } from '../../../app/hooks';
import './styles.scss';
import { useEffect } from 'react';
import { store } from '../../../app/store';
import { getCreditById, setSelectedCredit } from '../../../app/slices/credits';
import { useParams } from 'react-router-dom';

export const CreditPaymentSystem = () => {
  const params = useParams();
  const creditSelected = useAppSelector(
    (state) => state.credits.creditSelected
  );

  useEffect(() => {
    store.dispatch(getCreditById(params.id ?? '')).unwrap();

    return () => {
      store.dispatch(setSelectedCredit(null));
    };
  }, [params.id]);

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
      <PaymentHistory creditSelected={creditSelected} />
    </div>
  );
};
