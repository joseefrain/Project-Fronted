import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ICredit } from '../../../interfaces/creditsInterfaces';
import { useRoleAccess } from '../../../shared/hooks/useRoleAccess';
import { PAGES_MODULES } from '../../../shared/helpers/roleHelper';

interface ProductsTableProps {
  currentItems: ICredit[];
}

export const TablaCredits = ({ currentItems }: ProductsTableProps) => {
  const navigate = useNavigate();
  const access = useRoleAccess(PAGES_MODULES.CREDITOS);

  const handleSelectEntity = (entity: ICredit) => {
    navigate(`/credits/${entity._id}`);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Aprobado por</TableHead>
            <TableHead className="w-fit">Asignado a </TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Estado</TableHead>
            {access.update && (
              <TableHead className="text-center">
                <span className="">Actions</span>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems?.map((product) => (
            <TableRow
              key={product._id ?? ''}
              onClick={() => handleSelectEntity(product)}
            >
              <TableCell className="font-medium">
                {product?.transaccionId.usuarioId.username ?? ''}
              </TableCell>
              <TableCell className="font-medium">
                {product?.entidadId.generalInformation.name ?? ''}
              </TableCell>
              <TableCell>{product.modalidadCredito}</TableCell>
              <TableCell
                className={`${product.estadoCredito === 'ABIERTO' ? 'text-blue-500' : ''}`}
              >
                {product.estadoCredito}
              </TableCell>
              {access.update && (
                <TableCell>
                  <div
                    onClick={() => handleSelectEntity(product)}
                    className="flex items-center justify-center"
                  >
                    <Pencil className="w-4 h-4 mr-2 cursor-pointer" />
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
