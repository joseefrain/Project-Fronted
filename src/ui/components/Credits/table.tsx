import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ITransacionCredit } from '../../../interfaces/creditsInterfaces';
import { useRoleAccess } from '../../../shared/hooks/useRoleAccess';
import { PAGES_MODULES } from '../../../shared/helpers/roleHelper';
import { Button } from '../../../components/ui/button';
import { CreditReturnContainer } from './CreditReturnContainer';

interface ProductsTableProps {
  currentItems: ITransacionCredit[];
  filterType: string;
}

export const TablaCredits = ({
  currentItems,
  filterType,
}: ProductsTableProps) => {
  const navigate = useNavigate();
  const access = useRoleAccess(PAGES_MODULES.CREDITOS);

  const handleSelectEntity = (entity: ITransacionCredit) => {
    navigate(`/credits/${entity.credito._id}`);
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
          {currentItems?.map((item) => (
            <TableRow key={item.credito._id ?? ''}>
              <TableCell className="font-medium">
                {item.credito?.transaccionId.usuarioId.username ?? ''}
              </TableCell>
              <TableCell className="font-medium">
                {item.credito?.entidadId.generalInformation.name ?? ''}
              </TableCell>
              <TableCell>{item.credito.modalidadCredito}</TableCell>
              <TableCell
                className={`${item.credito.estadoCredito === 'ABIERTO' ? 'text-blue-500' : ''}`}
              >
                {item.credito.estadoCredito}
              </TableCell>
              {access.update && (
                <TableCell className="flex items-center justify-center gap-2">
                  <Button
                    onClick={() => handleSelectEntity(item)}
                    className="flex items-center justify-center"
                    variant={filterType === 'historial' ? 'outline' : 'default'}
                    size="sm"
                  >
                    {filterType === 'historial' ? (
                      <>
                        <Eye className="w-2 h-2 cursor-pointer" /> Ver
                      </>
                    ) : (
                      <>
                        <Pencil className="w-2 h-2 cursor-pointer" /> Pagar
                      </>
                    )}
                  </Button>
                  <CreditReturnContainer credit={item} />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
