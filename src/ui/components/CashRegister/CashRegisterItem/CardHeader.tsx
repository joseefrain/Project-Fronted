import { ICajaBrach } from '@/app/slices/cashRegisterSlice';
import { CardHeader } from '@/components/ui/card';
import { IRoleAccess } from '@/interfaces/roleInterfaces';
import { CashRegisterOpen } from './CashRegisterOpen';
import { CashRegisterClose } from './CashRegisterClose';
import { ExternalLink } from 'lucide-react';

interface CardHeaderCashierProps {
  cashRegister: ICajaBrach;
  openModalHistory: () => void;
  access: IRoleAccess;
}

const CardHeaderCashier = ({
  cashRegister,
  openModalHistory,
  access,
}: CardHeaderCashierProps) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
          <span className="text-xl font-bold text-primary">
            {cashRegister.consecutivo}
          </span>
        </div>
        <div
          onClick={openModalHistory}
          className="hover:text-primary hover:cursor-pointer hover:shadow-md"
        >
          <ExternalLink />
        </div>
      </div>
      {access.update &&
        (cashRegister.estado === 'ABIERTA' ? (
          <CashRegisterClose box={cashRegister} />
        ) : (
          <CashRegisterOpen box={cashRegister} />
        ))}
    </CardHeader>
  );
};

export default CardHeaderCashier;
