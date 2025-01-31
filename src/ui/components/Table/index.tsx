import { useAppSelector } from '@/app/hooks';
import { getAllGroupsSlice } from '@/app/slices/groups';
import { store } from '@/app/store';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ITablaBranch } from '@/interfaces/branchInterfaces';
import { GetBranches } from '@/shared/helpers/Branchs';
import { Boxes } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import Pagination from '../../../shared/components/ui/Pagination/Pagination';
import ProductsTable from './ProductTable';
import SearchAndFilter from './sear';
import { useRoleAccess } from '../../../shared/hooks/useRoleAccess';
import { PAGES_MODULES } from '../../../shared/helpers/roleHelper';
import {
  createProduct,
  productByBranchId,
} from '../../../app/slices/productsSlice';

export function DataTableDemo() {
  const access = useRoleAccess(PAGES_MODULES.PRODUCTOS);
  const { Id } = useParams<{ Id: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string[]>([
    'active',
    'draft',
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const GroupsAll = useAppSelector((state) => state.categories.groups);
  const [selectedGroup, setSelectedGroup] = useState<{
    nombre: string;
    _id: string;
  } | null>(null);
  const productsXBranch = useAppSelector((state) => state.products.products);

  const handleSelectChange = (value: string) => {
    const selectedBranchId = value;
    const branch = GroupsAll.find((b) => b._id === selectedBranchId);
    if (branch) {
      setSelectedGroup({ nombre: branch.nombre, _id: branch._id ?? '' });
    }
  };

  const fetchData = async () => {
    if (!Id) return;
    await GetBranches(Id);
  };

  useEffect(() => {
    fetchData();
    store.dispatch(getAllGroupsSlice()).unwrap();
    store.dispatch(productByBranchId(Id as string)).unwrap();
  }, []);

  const filteredProducts = productsXBranch?.filter((product: ITablaBranch) =>
    product?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil((filteredProducts ?? []).length / itemsPerPage);

  const handleAddProduct = async (newProduct: ITablaBranch) => {
    try {
      const product: ITablaBranch = {
        ...newProduct,
      };
      await store.dispatch(createProduct(product)).unwrap();
      toast.success(`Producto ${product.nombre} creado exitosamente`);
    } catch (error) {
      toast.error('Error al crear producto: ' + error);
    }
  };

  return (
    <>
      <Toaster richColors position="bottom-right" />
      <div className="flex flex-col w-full">
        <main className="flex-1 py-4 md:py-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Boxes size={20} />
                <CardTitle>Products</CardTitle>
              </div>
              <CardDescription>Gestione sus productos</CardDescription>
            </CardHeader>
            <CardContent>
              <SearchAndFilter
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                onAddProduct={handleAddProduct}
                sucursalId={Id}
                handleSelectChange={handleSelectChange}
                selectedGroup={selectedGroup}
                groups={GroupsAll}
                showAddProductBtn={access.create}
              />
              {filteredProducts?.length === 0 ? (
                <span className="flex justify-center w-full text-sm text-center text-muted-foreground">
                  No hay productos en esta sucursal
                </span>
              ) : (
                <ProductsTable
                  handleSelectChange={handleSelectChange}
                  selectedGroup={selectedGroup}
                  groups={GroupsAll}
                  products={currentItems}
                  access={access}
                />
              )}
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </CardFooter>
          </Card>
        </main>
      </div>
    </>
  );
}
