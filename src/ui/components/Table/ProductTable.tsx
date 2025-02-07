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

  const handleOnDelete = (id: string) => {
    store.dispatch(removeProduct(id));
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead className="text-start">Descripcion</TableHead>
            <TableHead className="text-start">In Stock</TableHead>
            <TableHead className="text-start">Minimo Stock</TableHead>
            <TableHead>Costo unitario</TableHead>
            <TableHead>Precio</TableHead>
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
              <TableCell>{product?.stock || '0'}</TableCell>
              <TableCell>{product?.puntoReCompra || '0'}</TableCell>
              <TableCell>
                C$ {product.costoUnitario.$numberDecimal || '0'}
              </TableCell>
              <TableCell>C${product.precio.$numberDecimal}</TableCell>
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
