'use client';

import { useAppSelector } from '@/app/hooks';
import {
  fetchBranchById,
  updateSelectedBranch,
} from '@/app/slices/branchSlice';
import { getCasherById, getDiscountsByBranch } from '@/app/slices/salesSlice';
import { store } from '@/app/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Branch, ITablaBranch } from '@/interfaces/branchInterfaces';
import { IProductSale } from '@/interfaces/salesInterfaces';
import { getSelectedBranchFromLocalStorage } from '@/shared/helpers/branchHelpers';
import { GetBranches } from '@/shared/helpers/Branchs';
import { useEffect, useState } from 'react';
import { Cashier } from './Inventory';
import { Sale } from './Sale';
import { SaleHistory } from './SaleHistory';
import { Purchase } from '../Purchase/Purchase';
import { PurchaseCashier } from '../Purchase/Inventory';
import { PurchaseHistory } from '../Purchase/PurchaseHistory';

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
    <div className="container mx-auto">
      <Tabs defaultValue="sale">
        <div className="flex flex-col items-center justify-between gap-4 mb-9 sm:flex-row sm:items-center">
          <h1 className="text-4xl font-bold text-gray-800 font-onest w-[38%]">
            Transacción
          </h1>
          <TabsList className="gap-4 font-bold text-white bg-black">
            <TabsTrigger
              className="text-[#ffffff] font-bold border-b-2 border-bg-gray-200 border-opacity-0 bg-black font-onest"
              value="sale"
            >
              Nueva venta
            </TabsTrigger>
            <TabsTrigger
              className="text-[#ffffff] font-bold border-b-2 border-bg-gray-200 border-opacity-0 bg-black font-onest"
              value="purchase"
            >
              Nueva compra
            </TabsTrigger>
            <TabsTrigger
              className="bg-black text-[#ffffff] font-bold font-onest"
              value="sale-history"
            >
              Historial de ventas
            </TabsTrigger>
            <TabsTrigger
              className="bg-black text-[#ffffff] font-bold font-onest"
              value="purchase-history"
            >
              Historial de compras
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
        <TabsContent value="purchase">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 h-[36rem] max-h-[36rem]">
            <Purchase
              products={products}
              productSale={productSale}
              setProducts={setProducts}
              setProductSale={setProductSale}
            />
            <PurchaseCashier
              productSale={productSale}
              setProductSale={setProductSale}
            />
          </div>
        </TabsContent>
        <TabsContent value="sale-history">
          <SaleHistory />
        </TabsContent>
        <TabsContent value="purchase-history">
          <PurchaseHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
