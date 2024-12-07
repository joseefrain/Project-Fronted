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
import { useNavigate } from 'react-router-dom';
import { ICredit } from '../../../interfaces/creditsInterfaces';
import { store } from '../../../app/store';
import { setSelectedCredit } from '../../../app/slices/credits';

interface ProductsTableProps {
  currentItems: ICredit[];
}

export const TablaCredits = ({ currentItems }: ProductsTableProps) => {
  const navigate = useNavigate();

  const handleSelectEntity = (entity: ICredit) => {
    store.dispatch(setSelectedCredit(entity));
    navigate(`/credits/${entity._id}`);
  };

  const handleEditCredit = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    contactData: ICredit
  ) => {
    e.stopPropagation();
    console.log(contactData);
  };

  const handleDeleteCredit = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    contactData: ICredit
  ) => {
    e.stopPropagation();
    console.log(contactData);
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
            <TableHead>
              <span className="">Actions</span>
            </TableHead>
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
              <TableCell>
                <div className="flex items-center gap-3">
                  <div
                    onClick={(e) => handleEditCredit(e, product)}
                    className=""
                  >
                    <Pencil className="w-4 h-4 mr-2 cursor-pointer" />
                  </div>
                  <div onClick={(e) => handleDeleteCredit(e, product)}>
                    <Trash className="w-4 h-4 mr-2 cursor-pointer" />
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
