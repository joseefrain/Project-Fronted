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
import { useEffect, useState } from 'react';
import ProductsTable from './ProductTable';
import { useAppSelector } from '@/app/hooks';
import { searchForStockProductsAtBranch } from '@/app/slices/branchSlice';
import { getAllGroupsSlice } from '@/app/slices/groups';
import { InventarioSucursalWithPopulated } from '@/interfaces/transferInterfaces';
import Pagination from '@/shared/components/ui/Pagination/Pagination';
import { GetBranches } from '@/shared/helpers/Branchs';
import { Boxes } from 'lucide-react';
import { SearchComponent } from '../../../../shared/components/ui/Search';

export function ProductFormExist() {
  const user = useAppSelector((state) => state.auth.signIn.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [, setProducts] = useState<ITablaBranch[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
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
    if (user?.sucursalId?._id) {
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
    if (!user?.sucursalId || !user.sucursalId._id) return;
    const response = await GetBranches(user.sucursalId._id);
    setProducts(response);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredProducts = findData.filter(
    (product) =>
      product.productoId.nombre
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      product?.groupName?.toLowerCase().includes(searchTerm.toLowerCase())
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
      <main className="flex-1 py-4 md:py-6 font-onest">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Boxes size={20} />
              <CardTitle>Products</CardTitle>
            </div>
            <CardDescription>Gestione sus productos</CardDescription>
          </CardHeader>
          <div className="flex items-center justify-between p-6">
            <SearchComponent
              searchTerm={searchTerm}
              placeholder="Buscar productos"
              setSearchTerm={setSearchTerm}
            />
          </div>

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
                products={currentItems}
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
