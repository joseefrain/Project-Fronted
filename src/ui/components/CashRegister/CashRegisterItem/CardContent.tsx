import { ICajaBrach } from '@/app/slices/cashRegisterSlice';
import { IUser } from '@/app/slices/login';
import { CardContent } from '@/components/ui/card';
import { formatNumber } from '../../../../shared/helpers/Branchs';

interface CardContentProps {
  cashRegister: ICajaBrach;
}

export const CardContentCashier = ({ cashRegister }: CardContentProps) => {
  const formattedValue = formatNumber(
    cashRegister.montoEsperado.$numberDecimal
  );
  return (
    <CardContent>
      <p
        className={`mt-2 text-sm ${cashRegister.estado === 'ABIERTA' ? 'text-green-500' : 'text-red-500'}`}
      >
        Estado: {cashRegister.estado}
      </p>
      {cashRegister.estado === 'ABIERTA' && (
        <>
          <p
            className={`mt-2 text-sm ${cashRegister.estado === 'ABIERTA' ? 'text-green-500' : 'text-red-500'}`}
          >
            Usuario: {(cashRegister.usuarioAperturaId as IUser).username}
          </p>
          <p
            className={`mt-2 text-sm ${cashRegister.estado === 'ABIERTA' ? 'text-green-500' : 'text-red-500'}`}
          >
            Saldo: {formattedValue}
          </p>
        </>
      )}

      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-muted-foreground">
          Caja #{cashRegister.consecutivo}
        </span>
      </div>
    </CardContent>
  );
};

export default CardContent;
