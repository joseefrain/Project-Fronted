import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IRoles } from '@/app/slices/login';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { IProductInTransit } from '@/interfaces/transferInterfaces';
import { getFormatedDate } from '@/shared/helpers/transferHelper';
import { Branch } from '@/interfaces/branchInterfaces';

export interface IUserRole {
  _id: string;
  username: string;
  role: IRoles;
  sucursalId?: Branch;
}

interface ProductsTableProps {
  products: IProductInTransit[];
  userRoles?: IUserRole | undefined;
}

const ProductsTable = ({ products }: ProductsTableProps) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Consecutivo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-fit">Sucursal de Destino</TableHead>
            <TableHead className="w-fit">Description</TableHead>
            <TableHead>Ultimo Movimiento</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">
                {product.consucutivoPedido}
              </TableCell>
              <TableCell className="font-medium">{product.nombre}</TableCell>
              <TableCell className="font-medium">
                {product.sucursalDestino}
              </TableCell>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-64 overflow-hidden whitespace-nowrap text-ellipsis text-center">
                    {product.descripcion}
                  </TooltipTrigger>
                  <TooltipContent>{product.descripcion}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TableCell>
                {getFormatedDate(new Date(product.ultimoMovimiento))}
              </TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{`$${product.precio.$numberDecimal}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default ProductsTable;
