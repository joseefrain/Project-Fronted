import { Card } from '@/components/ui/card';
import { ICajaBrach } from '../../../../app/slices/cashRegisterSlice';
import { useState } from 'react';
import { ModalHistory } from '../box-history';
import { IRoleAccess } from '../../../../interfaces/roleInterfaces';
import { CardContentCashier } from './CardContent';
import CardHeaderCashier from './CardHeader';

interface CashRegisterCardProps {
  cashRegister: ICajaBrach;
}

export function CashRegisterCard({
  cashRegister,
  access,
}: CashRegisterCardProps & { access: IRoleAccess }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalHistory = () => {
    setIsModalOpen(true);
  };

  const closeModalHistory = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Card
        key={cashRegister._id}
        className="relative overflow-hidden transition-all bg-white font-onest group hover:shadow-lg dark:bg-neutral-950"
      >
        <CardHeaderCashier
          cashRegister={cashRegister}
          openModalHistory={openModalHistory}
          access={access}
        />
        <CardContentCashier cashRegister={cashRegister} />
      </Card>

      {isModalOpen && (
        <>
          <ModalHistory
            data={cashRegister}
            isOpen={isModalOpen}
            onClose={closeModalHistory}
          />
        </>
      )}
    </>
  );
}
