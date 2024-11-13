'use client';

import { Sale } from './Sale';
import { Cashier } from './Inventory';
import { SaleHistory } from './SaleHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/app/hooks';
import { Branch, ITablaBranch } from '@/interfaces/branchInterfaces';
import { GetBranches } from '@/shared/helpers/Branchs';
import { store } from '@/app/store';
import {
  fetchBranchById,
  updateSelectedBranch,
} from '@/app/slices/branchSlice';
import { getCasherById, getDiscountsByBranch } from '@/app/slices/salesSlice';
import { getSelectedBranchFromLocalStorage } from '@/shared/helpers/branchHelpers';
import { IProductSale } from '@/interfaces/salesInterfaces';

export default function SalesInventorySystem() {
  const cashierId = useAppSelector((state) => state.auth.signIn.cajaId);
  const user = useAppSelector((state) => state.auth.signIn.user);
  const branchStoraged = getSelectedBranchFromLocalStorage();
  const [products, setProducts] = useState<ITablaBranch[]>([]);
  const [productSale, setProductSale] = useState<IProductSale[]>([]);

  const loadProductsByBranch = async (branch: Branch) => {
    const response = await GetBranches(branch._id ?? '');

    store.dispatch(
      updateSelectedBranch({
        ...branch,
        products: response,
      })
    );
    setProducts(response);
    await store.dispatch(getCasherById(cashierId ?? ''));
    await store.dispatch(getDiscountsByBranch(branch._id ?? ''));
  };

  const handleLoadBranch = (branch: Branch | undefined) => {
    if (branch) {
      loadProductsByBranch(branch);
    } else {
      store.dispatch(updateSelectedBranch(null));
      setProducts([]);
    }
  };

  useEffect(() => {
    const branchId = !user?.sucursalId
      ? (branchStoraged ?? '')
      : (user?.sucursalId._id ?? '');

    store.dispatch(fetchBranchById(branchId)).then((response) => {
      handleLoadBranch(response.payload as Branch);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container p-4 mx-auto">
      <Tabs defaultValue="sale">
        <div className="flex flex-col items-start justify-center gap-4 mb-4 sm:flex-row sm:items-center">
          <TabsList className="gap-4 font-bold text-white bg-black">
            <TabsTrigger
              className="text-[#ffffff] font-bold border-b-2 border-bg-gray-200 border-opacity-0 bg-black"
              value="sale"
            >
              Nueva venta
            </TabsTrigger>
            <TabsTrigger
              className="bg-black text-[#ffffff] font-bold"
              value="history"
            >
              Historial de ventas
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="sale">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 h-[36rem] max-h-[36rem]">
            <Sale
              products={products}
              productSale={productSale}
              setProducts={setProducts}
              setProductSale={setProductSale}
            />
            <Cashier
              productSale={productSale}
              setProductSale={setProductSale}
            />
          </div>
        </TabsContent>
        <TabsContent value="history">
          <SaleHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
