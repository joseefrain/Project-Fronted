import { ICajaBrach } from '@/app/slices/cashRegisterSlice';
import { IUser } from '@/app/slices/login';
import { CardContent } from '@/components/ui/card';

interface CardContentProps {
  cashRegister: ICajaBrach;
}

export const CardContentCashier = ({ cashRegister }: CardContentProps) => {
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
            Saldo: {cashRegister.montoEsperado.$numberDecimal}
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
