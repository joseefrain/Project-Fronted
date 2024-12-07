import { useAppSelector } from '@/app/hooks';
import { createProduct } from '@/app/slices/branchSlice';
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
import { IProductoGroups, ITablaBranch } from '@/interfaces/branchInterfaces';
import { GetBranches } from '@/shared/helpers/Branchs';
import { Boxes } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import Pagination from '../../../shared/components/ui/Pagination/Pagination';
import ProductsTable from './ProductTable';
import SearchAndFilter from './sear';

export function Products() {
  const user = useAppSelector((state) => state.auth.signIn.user);
  const [products, setProducts] = useState<ITablaBranch[]>([]);
  const userRoles = useAppSelector((state) => state.auth.signIn.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string[]>([
    'active',
    'draft',
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchData = async () => {
    if (user?.sucursalId) {
      const response = await GetBranches(user.sucursalId._id ?? '');
      setProducts(response);
    } else {
      console.log('admin user debe obtener productos generales');
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredProducts = products.filter((product) =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleAddProduct = async (newProduct: ITablaBranch) => {
    try {
      const product: ITablaBranch = {
        ...newProduct,
      };
      await store.dispatch(createProduct(product)).unwrap();
      setProducts((prevProducts) => [...prevProducts, product]);
      toast.success(`Producto ${product.nombre} creado exitosamente`);
    } catch (error) {
      toast.error('Error al crear producto:' + error);
    }
  };

  const GroupsAll = useAppSelector((state) => state.categories.groups);
  const [selectedGroup, setSelectedGroup] = useState<{
    nombre: string;
    _id: string;
  } | null>(null);

  const [, setGroups] = useState<IProductoGroups[]>([]);

  const handleSelectChange = (value: string) => {
    const selectedBranchId = value;
    const branch = GroupsAll.find((b) => b._id === selectedBranchId);

    if (branch) {
      setSelectedGroup({ nombre: branch.nombre, _id: branch._id ?? '' });
    }
  };

  const fetchDataGroup = async () => {
    if (!selectedGroup) return;

    const response = await GetBranches(selectedGroup._id);
    setGroups(response);
  };

  useEffect(() => {
    store.dispatch(getAllGroupsSlice()).unwrap();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchDataGroup();
    }
  }, [selectedGroup]);

  return (
    <>
      <Toaster richColors position="bottom-right" />
      <div className="flex flex-col w-full">
        <main className="flex-1 py-4 md:py-6 font-onest">
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
                sucursalId={user?.sucursalId?._id}
                handleSelectChange={handleSelectChange}
                selectedGroup={selectedGroup}
                groups={GroupsAll}
              />
              {filteredProducts.length === 0 ? (
                <span className="flex justify-center w-full text-sm text-center text-muted-foreground">
                  No hay productos en esta sucursal
                </span>
              ) : (
                <ProductsTable
                  products={currentItems}
                  selectedGroup={selectedGroup}
                  groups={GroupsAll}
                  userRoles={userRoles}
                  handleSelectChange={handleSelectChange}
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
