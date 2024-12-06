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
import { IEntities } from '../../../interfaces/entitiesInterfaces';
import { useNavigate } from 'react-router-dom';
import { setSelectedEntity } from '../../../app/slices/entities';
import { store } from '../../../app/store';

interface IUserRole {
  _id: string;
  username: string;
  role: IRoles;
  sucursalId?: Branch;
}

interface ProductsTableProps {
  currentItems: IEntities[];
  userRoles?: IUserRole | undefined;
  handleEditContact: (contactData: IEntities) => void;
}

export const TablaContacts = ({
  currentItems,
  userRoles,
  handleEditContact,
}: ProductsTableProps) => {
  const navigate = useNavigate();

  const handleSelectEntity = (entity: IEntities) => {
    store.dispatch(setSelectedEntity(entity));
    navigate(`/contacts/${entity._id}`);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="w-fit">Identificacion</TableHead>
            <TableHead>Telefono</TableHead>
            <TableHead>Tipo</TableHead>
            {userRoles?.role !== 'admin' && (
              <TableHead>
                <span className="">Actions</span>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems?.map((product) => (
            <TableRow key={product._id}>
              <TableCell
                className="font-medium"
                onClick={() => handleSelectEntity(product)}
              >
                {product?.generalInformation.name}
              </TableCell>
              <TableCell>
                {product.generalInformation.identificationNumber}
              </TableCell>
              <TableCell>{product.contactInformation.telephone}</TableCell>
              <TableCell>
                {product.type === 'customer' ? 'Cliente' : 'Proveedor'}
              </TableCell>
              <TableCell>
                {userRoles?.role !== 'admin' && (
                  <div className="flex items-center gap-3">
                    <div
                      onClick={() => handleEditContact(product)}
                      className=""
                    >
                      <Pencil className="mr-2 h-4 w-4 cursor-pointer" />
                    </div>
                    <div>
                      <Trash className="mr-2 h-4 w-4 cursor-pointer" />
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
