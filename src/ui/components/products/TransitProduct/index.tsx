import { useAppSelector } from '@/app/hooks';
import { fetchBranches } from '@/app/slices/branchSlice';
import { clearProducts, productsTransit } from '@/app/slices/productsSlice';
import { store } from '@/app/store';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ITablaBranch } from '@/interfaces/branchInterfaces';
import { SearchComponent } from '@/shared/components/ui/Search';
import { GetBranches } from '@/shared/helpers/Branchs';
import { Boxes } from 'lucide-react';
import { useEffect, useState } from 'react';
import Pagination from '../../../../shared/components/ui/Pagination/Pagination';
import ProductsTable from './Table';

export const ProductsTransit = () => {
  const dataAllProducts = useAppSelector(
    (state) => state.products.transitProducts
  );
  const branches = useAppSelector((state) => state.branches.data);
  const userRoles = useAppSelector((state) => state.auth.signIn.user);
  const dataFilterID = branches.filter(
    (branch) => branch._id === userRoles?.sucursalId?._id
  );
  const filteredBranche = userRoles?.role === 'root' ? branches : dataFilterID;
  const [selectedBranch, setSelectedBranch] = useState<{
    nombre: string;
    _id: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [, setProducts] = useState<ITablaBranch[]>([]);

  useEffect(() => {
    if (filteredBranche.length === 1 && !selectedBranch) {
      const branch = filteredBranche[0];
      setSelectedBranch({ nombre: branch.nombre, _id: branch._id ?? '' });
    }
  }, [filteredBranche, selectedBranch]);

  const fetchData = async () => {
    if (!selectedBranch) return;
    const response = await GetBranches(selectedBranch._id);
    setProducts(response);
  };

  useEffect(() => {
    store.dispatch(fetchBranches()).unwrap();
    if (selectedBranch) {
      fetchData();
    }
  }, [selectedBranch]);

  useEffect(() => {
    if (selectedBranch) {
      store.dispatch(clearProducts());
      store.dispatch(productsTransit(selectedBranch._id)).unwrap();
    }
  }, [selectedBranch]);

  const handleSelectChangeBranch = (value: string) => {
    const branch = branches.find((b) => b._id === value);
    if (branch) {
      setSelectedBranch({ nombre: branch.nombre, _id: branch._id ?? '' });
    }
  };

  const filteredProducts = dataAllProducts?.filter((product) =>
    product.nombre?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts?.length / itemsPerPage);

  return (
    <div className="flex flex-col w-full">
      <main className="flex-1 py-4 md:py-6 font-onest">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Boxes size={20} />
              <CardTitle>Products</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-4">
              <SearchComponent
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
              {userRoles?.role === 'root' && (
                <div className="mb-4">
                  <Select onValueChange={handleSelectChangeBranch}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione Sucursal" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredBranche.map((branch) => (
                        <SelectItem
                          key={branch._id}
                          value={branch._id as string}
                        >
                          {branch.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {currentItems?.length === 0 ? (
              <span className="flex justify-center w-full text-sm text-center text-muted-foreground">
                No hay productos en esta sucursal
              </span>
            ) : (
              <ProductsTable products={currentItems} />
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
};
