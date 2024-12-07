import { IRoles } from '@/app/slices/login';
import { updateProduct } from '@/app/slices/productsSlice';
import { store } from '@/app/store';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Branch,
  IProductoGroups,
  ITablaBranch,
} from '@/interfaces/branchInterfaces';
import {
  InventarioSucursal,
  InventarioSucursalWithPopulated,
} from '@/interfaces/transferInterfaces';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { toast, Toaster } from 'sonner';
import ProductForm from './ProductForm';

interface ProductsTableProps {
  products: InventarioSucursalWithPopulated[];
  handleSelectChange: (value: string) => void;
  selectedGroup: {
    nombre: string;
    _id: string;
  } | null;
  groups: IProductoGroups[];
  userRoles:
    | {
        _id: string;
        username: string;
        role: IRoles;
        sucursalId?: Branch;
      }
    | undefined;
}

const ProductsTable = ({
  products,
  handleSelectChange,
  selectedGroup,
  groups,
  userRoles,
}: ProductsTableProps) => {
  const [editingProduct, setEditingProduct] =
    useState<InventarioSucursal | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditProduct = (updatedProduct: ITablaBranch) => {
    try {
      store.dispatch(updateProduct(updatedProduct)).unwrap();
      toast.success('Product updated successfully');
    } catch (error) {
      console.log(error);
      toast.error('Error updating product: ');
    }
  };

  const handleAddToBranchOnly = (product: InventarioSucursal) => {
    setEditingProduct(product);
    setIsEditing(true);
  };

  return (
    <>
      <Toaster richColors position="bottom-right" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>In Stock</TableHead>
            {userRoles?.role !== 'admin' && (
              <TableHead>
                <span className="">Actions</span>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((product) => (
            <TableRow key={product.productoId._id}>
              <TableCell>{product.productoId._id}</TableCell>
              <TableCell className="font-medium">
                {product.productoId.nombre}
              </TableCell>
              <TableCell>${product.precio.$numberDecimal}</TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="w-64 overflow-hidden whitespace-nowrap text-ellipsis">
                      {product.productoId.descripcion}
                    </TooltipTrigger>
                    <TooltipContent>
                      {product.productoId.descripcion}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>{product?.stock || '0'}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handleAddToBranchOnly(
                      product as unknown as InventarioSucursal
                    )
                  }
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  Agregar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="font-onest">
          <DialogHeader>
            <DialogTitle>Agregar producto a sucursal</DialogTitle>
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
