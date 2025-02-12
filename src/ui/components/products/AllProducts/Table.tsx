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
import { dataCoins } from '../../../../interfaces/salesInterfaces';
import { formatNumber } from '../../../../shared/helpers/Branchs';

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
  const monedaSimbole = dataCoins.currentS;
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripcion</TableHead>
            <TableHead className="text-center">Sucursal</TableHead>
            <TableHead className="text-center">Minimo Stock</TableHead>
            <TableHead className="text-center">Stock</TableHead>
            <TableHead className="text-center">Costo Unitario</TableHead>
            <TableHead className="text-center">Precio</TableHead>
            {(access.update || access.delete) && (
              <TableHead className="text-center">
                <span className="">Acciones</span>
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
                  <TooltipTrigger className="w-64 overflow-hidden whitespace-nowrap text-ellipsis text'-center">
                    {product.descripcion}
                  </TooltipTrigger>
                  <TooltipContent>{product.descripcion}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TableCell className="text-center">
                {product.nombreSucursal}
              </TableCell>
              <TableCell className="text-center">
                {product.puntoReCompra}
              </TableCell>
              <TableCell
                className={
                  product?.puntoReCompra !== undefined &&
                  product?.stock <= product?.puntoReCompra
                    ? 'text-red-500 text-center'
                    : 'text-green-500 text-center'
                }
              >
                {product.stock}
              </TableCell>
              <TableCell className="text-center">
                {monedaSimbole}
                {formatNumber(Number(product?.costoUnitario?.$numberDecimal)) ||
                  '0'}
              </TableCell>

              <TableCell className="text-center">
                {monedaSimbole}
                {formatNumber(Number(product.precio.$numberDecimal))}
              </TableCell>
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
