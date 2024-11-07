import { useEffect, useState } from 'react';
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { store } from '@/app/store';
import Pagination from '../../../../shared/components/ui/Pagination/Pagination';
import { useAppSelector } from '@/app/hooks';
import { SearchComponent } from '@/shared/components/ui/Search';

import { Boxes } from 'lucide-react';
import { ProductsCategoriesTable } from './Table';
import { useParams } from 'react-router-dom';
import { GetProductsByGroup } from '@/shared/helpers/Branchs';
import { IProductoGroups } from '@/interfaces/branchInterfaces';
import { getProductsByGroup } from '@/api/services/groups';

export const ProductsCategories = () => {
  const dataAllProducts = useAppSelector(
    (state) => state.categories.selectedGroup
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedProductCategory, setSelectedProductCategory] = useState<
    IProductoGroups[]
  >([]);
  const { id } = useParams<{ id: string }>();

  const fetchData = async () => {
    if (!id) return;
    try {
      const result = await getProductsByGroup(id);
      console.log(result, 'Fetched product categories');
      setSelectedProductCategory(result);
    } catch (error) {
      console.error('Failed to fetch products by group:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

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
      <main className="flex-1 p-4 md:p-6">
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
