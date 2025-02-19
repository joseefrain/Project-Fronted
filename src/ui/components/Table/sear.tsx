import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { IProductoGroups, ITablaBranch } from '@/interfaces/branchInterfaces';
import { SearchComponent } from '@/shared/components/ui/Search';
import { PlusCircle, Search } from 'lucide-react';
import ProductForm from './ProductForm';
import { formatNumber } from '../../../shared/helpers/Branchs';
import { useAppSelector } from '../../../app/hooks';
import { ExportToExcel } from '../../../shared/components/ui/ExportToExcel/ExportToExcel';
import { useLocation } from 'react-router-dom';
import { getFormatedDate } from '../../../shared/helpers/transferHelper';

interface SearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string[];
  setFilterStatus: (statuses: string[]) => void;
  onAddProduct: (newProduct: ITablaBranch) => void;
  sucursalId: string | undefined;
  handleSelectChange: (value: string) => void;
  selectedGroup: {
    nombre: string;
    _id: string;
  } | null;
  groups: IProductoGroups[];
  showAddProductBtn?: boolean;
  currentProducts?: ITablaBranch[];
}

const SearchAndFilter = ({
  searchTerm,
  setSearchTerm,
  onAddProduct,
  sucursalId,
  handleSelectChange,
  selectedGroup,
  groups,
  showAddProductBtn,
  currentProducts,
}: SearchAndFilterProps) => {
  const textSearch = 'Nombre, Código ';

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <SearchComponent
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder={textSearch}
          />
        </div>
      </div>

      {showAddProductBtn && (
        <AddProduct
          groups={groups}
          handleSelectChange={handleSelectChange}
          onAddProduct={onAddProduct}
          selectedGroup={selectedGroup}
          sucursalId={sucursalId}
          currentProducts={currentProducts}
        />
      )}
    </div>
  );
};

export default SearchAndFilter;

interface AddProductProps {
  groups: IProductoGroups[];
  handleSelectChange: (value: string) => void;
  onAddProduct: (newProduct: ITablaBranch) => void;
  selectedGroup: SearchAndFilterProps['selectedGroup'];
  sucursalId: string | undefined;
  currentProducts?: ITablaBranch[];
}

export function AddProduct({
  groups,
  handleSelectChange,
  onAddProduct,
  selectedGroup,
  sucursalId,
  currentProducts,
}: AddProductProps) {
  const user = useAppSelector((state) => state.auth.signIn.user);
  const dataIdBranchs = user?.sucursalId?.nombre;
  const total = currentProducts?.reduce((acc, product) => {
    return acc + Number(product.costoUnitario.$numberDecimal);
  }, 0);
  const totalStock = currentProducts?.reduce((acc, product) => {
    return acc + product.stock;
  }, 0);
  let totalCosto = (totalStock ?? 0) * (total ?? 0);

  const columns: { key: keyof ITablaBranch; label: string }[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Sucursal' },
    { key: 'puntoReCompra', label: 'Min. Stock' },
    { key: 'stock', label: 'Stock' },
    {
      key: 'costoUnitario',
      label: 'Costo Unitario',
    },
    { key: 'precio', label: 'Precio' },
    { key: 'totalInventario', label: 'Total Inventario' },
  ];

  const formattedProducts = currentProducts?.map((product: any) => ({
    ...product,
    descripcion: dataIdBranchs,
    costoUnitario: ` ${formatNumber(Number(product?.costoUnitario?.$numberDecimal)) || '0'}`,
    precio: ` ${formatNumber(Number(product.precio.$numberDecimal))}`,
    totalInventario: ` ${formatNumber(
      Number(product.stock * product.costoUnitario.$numberDecimal)
        ? Number(product.stock * product.costoUnitario.$numberDecimal)
        : 0
    )}`,
  }));

  const location = useLocation();
  const path = location.pathname === '/purchase';

  const dateToday = new Date();
  const fileName = ` ${getFormatedDate(dateToday)}-Registros de productos.xlsx`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span>Agregar</span>
        </Button>
      </DialogTrigger>
      {!path && (
        <ExportToExcel
          data={formattedProducts || []}
          columns={columns}
          filename={fileName}
          totalRow={{
            label: 'Total de Inventario',
            value: formatNumber(totalCosto),
          }}
        />
      )}
      <DialogContent className="font-onest">
        <DialogHeader>
          <DialogTitle>Agregar Producto</DialogTitle>
        </DialogHeader>
        <ProductForm
          handleSelectChange={handleSelectChange}
          selectedGroup={selectedGroup}
          groups={groups}
          onSubmit={onAddProduct}
          sucursalId={sucursalId}
        />
      </DialogContent>
    </Dialog>
  );
}
