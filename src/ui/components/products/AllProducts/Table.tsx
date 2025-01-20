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
import { useRoleAccess } from '../../../../shared/hooks/useRoleAccess';
import { PAGES_MODULES } from '../../../../shared/helpers/roleHelper';
import { Button } from '../../../../components/ui/button';

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

const ProductsTable = ({ products }: ProductsTableProps) => {
  const access = useRoleAccess(PAGES_MODULES.PRODUCTOS);

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
            {(access.update || access.delete) && (
              <TableHead className="text-center">
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
              {(access.update || access.delete) && (
                <TableCell>
                  <div className="flex items-center justify-center gap-3">
                    {access.update && (
                      <Button variant="ghost" size="sm">
                        <Pencil className="w-4 h-4 cursor-pointer" />
                      </Button>
                    )}
                    {access.delete && (
                      <Button variant="ghost" size="sm">
                        <Trash className="w-4 h-4 cursor-pointer" />
                      </Button>
                    )}
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

export default ProductsTable;
