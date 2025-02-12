import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash } from 'lucide-react';
import { IProductoGroups, ITablaBranch } from '@/interfaces/branchInterfaces';
import ProductForm from './ProductForm';
import { store } from '@/app/store';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { IRoleAccess } from '../../../interfaces/roleInterfaces';
import {
  removeProduct,
  updateProductsOriginal,
} from '../../../app/slices/productsSlice';
import { formatNumber } from '../../../shared/helpers/Branchs';
import { dataCoins } from '../../../interfaces/salesInterfaces';

interface ProductsTableProps {
  products: ITablaBranch[] | undefined;
  handleSelectChange: (value: string) => void;
  selectedGroup: {
    nombre: string;
    _id: string;
  } | null;
  groups: IProductoGroups[];
}

const ProductsTable = ({
  products,
  handleSelectChange,
  selectedGroup,
  groups,
  access,
}: ProductsTableProps & { access: IRoleAccess }) => {
  const [editingProduct, setEditingProduct] = useState<ITablaBranch | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);

  const handleEditProduct = async (updatedProduct: ITablaBranch) => {
    try {
      const product: ITablaBranch = {
        ...updatedProduct,
      };

      if (product.inventarioSucursalId) {
        await store.dispatch(
          updateProductsOriginal({
            _id: product.inventarioSucursalId!,
            product,
          })
        );
        setIsEditing(false);
        setEditingProduct(null);
        toast.success(`Producto ${product.nombre} actualizado exitosamente`);
      }
    } catch (error) {
      toast.error('Error al actualizar producto: ' + error);
    }
    setIsEditing(false);
    setEditingProduct(null);
  };
  const handleOnDelete = async (id: string) => {
    try {
      await store.dispatch(removeProduct(id)).unwrap();
      toast.success(`Producto eliminado exitosamente`);
    } catch (error) {
      toast.error('' + error);
    }
  };

  const total = products?.reduce((acc, product) => {
    return acc + Number(product.costoUnitario.$numberDecimal);
  }, 0);
  const totalStock = products?.reduce((acc, product) => {
    return acc + product.stock;
  }, 0);
  let totalCosto = (totalStock ?? 0) * (total ?? 0);
  const monedaSimbole = dataCoins.currentS;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripcion</TableHead>
            <TableHead className="text-center">Minimo Stock</TableHead>
            <TableHead className="text-center">Stock</TableHead>
            {(access.update || access.delete) && (
              <>
                <TableHead className="text-center">Costo unitario</TableHead>
                <TableHead className="text-center">Total</TableHead>
              </>
            )}
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
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell className="font-medium">{product.nombre}</TableCell>

              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="w-64 overflow-hidden whitespace-nowrap text-ellipsis">
                      {product.descripcion}
                    </TooltipTrigger>
                    <TooltipContent>{product.descripcion}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="text-center">
                {product?.puntoReCompra || '0'}
              </TableCell>
              <TableCell
                className={
                  product?.puntoReCompra !== undefined &&
                  product?.stock <= product?.puntoReCompra
                    ? 'text-red-500 text-center'
                    : 'text-green-500 text-center'
                }
              >
                {product?.stock || '0'}
              </TableCell>
              {(access.update || access.delete) && (
                <>
                  <TableCell className="text-center">
                    {monedaSimbole}
                    {formatNumber(
                      Number(product?.costoUnitario?.$numberDecimal)
                    ) || '0'}
                  </TableCell>
                  <TableCell className="text-center">
                    {monedaSimbole}
                    {formatNumber(
                      Number(
                        product.stock * product.costoUnitario.$numberDecimal
                      )
                    )}
                  </TableCell>
                </>
              )}
              <TableCell className="text-center">
                {monedaSimbole}
                {formatNumber(Number(product.precio.$numberDecimal))}
              </TableCell>
              {(access.update || access.delete) && (
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    {access.update && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingProduct(product);
                          setIsEditing(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    )}

                    {access.delete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleOnDelete(product?.inventarioSucursalId!)
                        }
                      >
                        <Trash className="w-4 h-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
        {(access.update || access.delete) && (
          <>
            <TableFooter>
              <TableRow>
                <TableCell className="" colSpan={7}>
                  Total de Inventario{' '}
                </TableCell>
                <TableCell className="text-center text-green-500 border border-green-500">
                  {monedaSimbole}
                  {formatNumber(totalCosto)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </>
        )}
      </Table>
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              initialData={editingProduct}
              onSubmit={handleEditProduct}
              sucursalId={editingProduct.sucursalId}
              handleSelectChange={handleSelectChange}
              selectedGroup={selectedGroup}
              groups={groups}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductsTable;
