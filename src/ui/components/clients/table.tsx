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
import { IRoleAccess } from '../../../interfaces/roleInterfaces';

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
  handleDeleteContact: (id: string) => void;
}

export const TablaContacts = ({
  currentItems,
  access,
  handleEditContact,
  handleDeleteContact,
}: ProductsTableProps & { access: IRoleAccess }) => {
  const navigate = useNavigate();

  const handleSelectEntity = (entity: IEntities) => {
    store.dispatch(setSelectedEntity(entity));
    navigate(`/contacts/${entity._id}`);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table className="min-w-[768px]">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="w-fit">Identificacion</TableHead>
              <TableHead>Telefono</TableHead>
              <TableHead>Tipo</TableHead>
              {(access.update || access.delete) && (
                <TableHead className="text-center">
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
                {(access.update || access.delete) && (
                  <TableCell>
                    <div className="flex items-center justify-center gap-3">
                      {access.update && (
                        <div
                          onClick={() => handleEditContact(product)}
                          className=""
                        >
                          <Pencil className="w-4 h-4 mr-2 cursor-pointer" />
                        </div>
                      )}
                      {access.delete && (
                        <div onClick={() => handleDeleteContact(product._id!)}>
                          <Trash className="w-4 h-4 mr-2 cursor-pointer" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
