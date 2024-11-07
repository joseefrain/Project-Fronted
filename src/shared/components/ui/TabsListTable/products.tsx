import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Products } from '../../../../ui/components/Table/products';
import { useAppSelector } from '@/app/hooks';
import { Allproducts } from '@/ui/components/products/AllProducts';
import { ProductsTransit } from '@/ui/components/products/TransitProduct';
import { ProductFormExist } from '@/ui/components/products/ExistingProduct';
import { useEffect } from 'react';
import { store } from '@/app/store';
import { fetchBranches } from '@/app/slices/branchSlice';

export const ViewProucts = () => {
  const user = useAppSelector((state) => state.auth.signIn.user);

  useEffect(() => {
    store.dispatch(fetchBranches()).unwrap();
  }, []);

  return (
    <div className="container mx-auto">
      <Tabs defaultValue="listProduct">
        <div className="flex flex-col items-start justify-center gap-4 mb-4 sm:flex-row sm:items-center">
          <TabsList className="gap-4 font-bold text-white bg-black">
            <TabsTrigger
              className="text-[#ffffff] font-bold border-b-2 border-bg-gray-200 border-opacity-0 bg-black"
              value="listProduct"
            >
              Lista de Productos
            </TabsTrigger>
            <TabsTrigger
              className="bg-black text-[#ffffff] font-bold"
              value="existingProduct"
            >
              Agregar producto existente
            </TabsTrigger>
            <TabsTrigger
              className="bg-black text-[#ffffff] font-bold"
              value="productsTransit"
            >
              Productos en tránsito
            </TabsTrigger>
            {user?.role === 'root' && (
              <TabsTrigger
                className="bg-black text-[#ffffff] font-bold"
                value="allProduct"
              >
                Todos los producto
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        <TabsContent value="listProduct">
          <Products />
        </TabsContent>
        <TabsContent value="existingProduct">
          <ProductFormExist />
        </TabsContent>
        <TabsContent value="productsTransit">
          <ProductsTransit />
        </TabsContent>
        <TabsContent value="allProduct">
          <Allproducts />
        </TabsContent>
      </Tabs>
    </div>
  );
};
