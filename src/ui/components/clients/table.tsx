import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash } from 'lucide-react';
import { Branch, ITablaBranch } from '@/interfaces/branchInterfaces';
import { IRoles } from '@/app/slices/login';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface IUserRole {
  _id: string;
  username: string;
  role: IRoles;
  sucursalId?: Branch;
}

interface ProductsTableProps {
  products: ITablaBranch[];
  userRoles?: IUserRole | undefined;
}

export const TablaContacts = ({ products, userRoles }: ProductsTableProps) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="w-fit">Description</TableHead>
            <TableHead>Sucursal</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Price</TableHead>
            {userRoles?.role !== 'admin' && (
              <TableHead>
                <span className="">Actions</span>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((product) => (
            <TableRow key={product.inventarioSucursalId}>
              <TableCell className="font-medium">{product?.nombre}</TableCell>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-64 overflow-hidden whitespace-nowrap text-ellipsis">
                    {product.descripcion}
                  </TooltipTrigger>
                  <TooltipContent>{product.descripcion}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TableCell>{product.nombreSucursal}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{`$${product.precio.$numberDecimal}`}</TableCell>
              <TableCell>
                {userRoles?.role !== 'admin' && product.nombreSucursal && (
                  <div className="flex items-center gap-3">
                    <div className="">
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
