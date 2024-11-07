import { useEffect, useState } from 'react';
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { IProductoGroups, ITablaBranch } from '@/interfaces/branchInterfaces';
import { store } from '@/app/store';
import ProductsTable from './ProductTable';
// import Pagination from '../../../shared/components/ui/Pagination/Pagination';
import { useAppSelector } from '@/app/hooks';
import { getAllGroupsSlice } from '@/app/slices/groups';
import { GetBranches } from '@/shared/helpers/Branchs';
import {
  createProduct,
  searchForStockProductsAtBranch,
} from '@/app/slices/branchSlice';
import { InventarioSucursalWithPopulated } from '@/interfaces/transferInterfaces';
import { Boxes } from 'lucide-react';
import Pagination from '@/shared/components/ui/Pagination/Pagination';

export function ProductFormExist() {
  const user = useAppSelector((state) => state.auth.signIn.user);

  const [products, setProducts] = useState<ITablaBranch[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string[]>([
    'active',
    'draft',
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const userRoles = useAppSelector((state) => state.auth.signIn.user);
  const GroupsAll = useAppSelector((state) => state.categories.groups);
  const [selectedGroup, setSelectedGroup] = useState<{
    nombre: string;
    _id: string;
  } | null>(null);

  const [, setGroups] = useState<IProductoGroups[]>([]);
  const [findData, setFindData] = useState<InventarioSucursalWithPopulated[]>(
    []
  );

  const fetchData2 = async () => {
    if (user?.sucursalId) {
      const response = await store
        .dispatch(searchForStockProductsAtBranch(user.sucursalId._id))
        .unwrap();
      setFindData(response);
    }
  };

  useEffect(() => {
    fetchData2();
  }, []);

  const handleSelectChange = (value: string) => {
    const selectedBranchId = value;
    const branch = GroupsAll.find((b) => b._id === selectedBranchId);

    if (branch) {
      setSelectedGroup({ nombre: branch.nombre, _id: branch._id ?? '' });
    }
  };

  const fetchDataGroup = async () => {
    if (!selectedGroup) return;

    try {
      const response = await GetBranches(selectedGroup._id);
      setGroups(response);
    } catch (error) {
      console.error('', error);
    }
  };

  useEffect(() => {
    store.dispatch(getAllGroupsSlice()).unwrap();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchDataGroup();
    }
  }, [selectedGroup]);

  const fetchData = async () => {
    if (!user?.sucursalId) return;
    const response = await GetBranches(user.sucursalId._id);
    setProducts(response);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredProducts = findData.filter((product) =>
    product.productoId.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="flex flex-col w-full">
      <main className="flex-1 p-4 md:p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Boxes size={20} />
              <CardTitle>Products</CardTitle>
            </div>
            <CardDescription>Gestione sus productos</CardDescription>
          </CardHeader>
          <CardContent>
            {currentItems.length === 0 ? (
              <span className="flex justify-center w-full text-sm text-center text-muted-foreground">
                No hay productos en esta sucursal
              </span>
            ) : (
              <ProductsTable
                handleSelectChange={handleSelectChange}
                selectedGroup={selectedGroup}
                groups={GroupsAll}
                products={findData}
                userRoles={userRoles}
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
  );
}
