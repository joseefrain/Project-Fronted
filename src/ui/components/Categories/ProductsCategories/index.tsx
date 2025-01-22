import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { store } from '@/app/store';
import { SearchComponent } from '@/shared/components/ui/Search';
import { Boxes } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { productsCatetories } from '../../../../app/slices/groups';
import { useAppSelector } from '../../../../app/hooks';
import { IProducto } from '../../../../interfaces/transferInterfaces';
import Pagination from '../../../../shared/components/ui/Pagination/Pagination';
import { ProductsCategoriesTable } from './Table';

export const ProductsCategories = () => {
  const dataAllProducts = useAppSelector(
    (state) => state.categories.productsbyGroup?.products
  );
  const idBranch = useAppSelector(
    (state) => state.auth.signIn.user?.sucursalId?._id
  ) as string;
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        store.dispatch(productsCatetories({ id, idBranch }));
        console.log(id, idBranch, 'idbranch');
      } catch (error) {
        console.error('Failed to fetch products by group:', error);
      }
    };
    fetchData();
  }, [id, idBranch]);

  const filteredProducts = Array.isArray(dataAllProducts)
    ? dataAllProducts.filter((product: IProducto) =>
        product.nombre?.toLowerCase()?.includes(searchTerm.toLowerCase())
      )
    : [];
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts?.length / itemsPerPage);

  return (
    <div className="flex flex-col w-full">
      <main className="flex-1 py-4 md:py-6">
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
            </div>
            {currentItems?.length === 0 ? (
              <span className="flex justify-center w-full text-sm text-center text-muted-foreground">
                No hay productos en esta sucursal
              </span>
            ) : (
              <ProductsCategoriesTable products={currentItems} />
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
