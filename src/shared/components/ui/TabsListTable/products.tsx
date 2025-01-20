import { useAppSelector } from '@/app/hooks';
import { fetchBranches } from '@/app/slices/branchSlice';
import { store } from '@/app/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Allproducts } from '@/ui/components/products/AllProducts';
import { ProductFormExist } from '@/ui/components/products/ExistingProduct';
import { ProductsTransit } from '@/ui/components/products/TransitProduct';
import { useEffect } from 'react';
import { Products } from '../../../../ui/components/Table/products';
import './styles.scss';
import { ROLE } from '../../../../interfaces/roleInterfaces';

export const ViewProucts = () => {
  const user = useAppSelector((state) => state.auth.signIn.user);

  useEffect(() => {
    store.dispatch(fetchBranches()).unwrap();
  }, []);

  return (
    <div className="container mx-auto">
      <Tabs defaultValue="listProduct">
        <div className="container-TabsListTable ">
          <h1 className=" container-TabsListTable__title">Productos</h1>
          <TabsList className="container-TabsListTable__tabs">
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
            {user?.role === ROLE.ROOT && (
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
