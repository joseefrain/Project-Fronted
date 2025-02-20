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
import { IProductoGroups, ITablaBranch } from '@/interfaces/branchInterfaces';
import { GetBranches } from '@/shared/helpers/Branchs';
import { Boxes } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import Pagination from '../../../shared/components/ui/Pagination/Pagination';
import ProductsTable from './ProductTable';
import SearchAndFilter from './sear';
import { PAGES_MODULES } from '../../../shared/helpers/roleHelper';
import { useRoleAccess } from '../../../shared/hooks/useRoleAccess';
import { createProduct } from '../../../app/slices/productsSlice';

export function Products() {
  const access = useRoleAccess(PAGES_MODULES.PRODUCTOS);
  const user = useAppSelector((state) => state.auth.signIn.user);
  const dataProducts = useAppSelector((state) => state.products.products) || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string[]>([
    'active',
    'draft',
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.sucursalId) {
        try {
          await GetBranches(user.sucursalId._id ?? '');
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      } else {
        console.log('Admin user debe obtener productos generales');
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredProducts = Array.isArray(dataProducts)
    ? dataProducts.filter(
        (product) =>
          product?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product?.barCode?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts!.length / itemsPerPage);

  const handleAddProduct = async (newProduct: ITablaBranch) => {
    try {
      const product: ITablaBranch = {
        ...newProduct,
      };
      await store.dispatch(createProduct(product)).unwrap();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                currentProducts={dataProducts}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                onAddProduct={handleAddProduct}
                sucursalId={user?.sucursalId?._id}
                handleSelectChange={handleSelectChange}
                selectedGroup={selectedGroup}
                groups={GroupsAll}
                showAddProductBtn={access.create}
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
                  handleSelectChange={handleSelectChange}
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
