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
import { IProducto } from '@/interfaces/transferInterfaces';
import { Branch } from '@/interfaces/branchInterfaces';

export interface IUserRole {
  _id: string;
  username: string;
  role: IRoles;
  sucursalId?: Branch;
}

interface ProductsTableProps {
  products: IProducto[];
  userRoles?: IUserRole | undefined;
}

export const ProductsCategoriesTable = ({ products }: ProductsTableProps) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>id</TableHead>
            <TableHead className="text-center max-w-min w-fit">
              Nombre
            </TableHead>
            <TableHead className="text-center ">Descripcion</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((product) => (
            <TableRow key={product._id}>
              <TableCell className="font-onest">{product._id}</TableCell>
              <TableCell className="font-onest">{product.nombre}</TableCell>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-[40rem] font-onest overflow-hidden max-w-min whitespace-nowrap text-ellipsis text-center">
                    {product.descripcion}
                  </TooltipTrigger>
                  <TooltipContent className="font-onest">
                    {product.descripcion}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
