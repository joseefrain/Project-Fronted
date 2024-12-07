import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash } from 'lucide-react';
import { Branch } from '@/interfaces/branchInterfaces';
import { IRoles } from '@/app/slices/login';
import { useNavigate } from 'react-router-dom';
import { ICredit } from '../../../interfaces/creditsInterfaces';

interface IUserRole {
  _id: string;
  username: string;
  role: IRoles;
  sucursalId?: Branch;
}

interface ProductsTableProps {
  currentItems: ICredit[];
  userRoles?: IUserRole | undefined;
  handleEditCredit: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    contactData: ICredit
  ) => void;
}

export const TablaCredits = ({
  currentItems,
  userRoles,
  handleEditCredit,
}: ProductsTableProps) => {
  const navigate = useNavigate();

  const handleSelectEntity = (entity: ICredit) => {
    // store.dispatch(setSelectedEntity(entity));
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
            {userRoles?.role !== 'admin' && (
              <TableHead>
                <span className="">Actions</span>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems?.map((product) => (
            <TableRow
              key={product.transaccionId.userId}
              onClick={() => handleSelectEntity(product)}
            >
              <TableCell className="font-medium">
                {product?.entidadId.generalInformation.name ?? ''}
              </TableCell>
              <TableCell>{product.modalidadCredito}</TableCell>
              <TableCell>{product.estadoCredito}</TableCell>
              <TableCell>
                {userRoles?.role !== 'admin' && (
                  <div className="flex items-center gap-3">
                    <div
                      onClick={(e) => handleEditCredit(e, product)}
                      className=""
                    >
                      <Pencil className="w-4 h-4 mr-2 cursor-pointer" />
                    </div>
                    <div>
                      <Trash className="w-4 h-4 mr-2 cursor-pointer" />
                    </div>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
