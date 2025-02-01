'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IProductSale, ITypeTransaction } from '@/interfaces/salesInterfaces';
import { useState } from 'react';

import { Purchase } from '../Purchase/Purchase';
import { PurchaseCashier } from '../Purchase/Inventory';
import { PurchaseHistory } from '../Purchase/PurchaseHistory';
import { PAGES_MODULES } from '../../../shared/helpers/roleHelper';
import { useRoleAccess } from '../../../shared/hooks/useRoleAccess';
import { ReturnHistory } from './ReturnHistory';

export const PurchaseSale = () => {
  const access = useRoleAccess(PAGES_MODULES.COMPRAS);
  const [productSale, setProductSale] = useState<IProductSale[]>([]);

  return (
    <div className="container mx-auto">
      <Tabs defaultValue={access.create ? 'purchase' : 'purchase-history'}>
        <div className="flex flex-col items-center justify-between gap-4 mb-9 sm:flex-row sm:items-center">
          <h1 className="text-4xl font-bold text-gray-800 font-onest w-[38%] dark:text-white">
            Compras
          </h1>
          <TabsList className="gap-4 font-bold text-white bg-black">
            {access.create && (
              <TabsTrigger
                className="text-[#ffffff] font-bold border-b-2 border-bg-gray-200 border-opacity-0 bg-black font-onest"
                value="purchase"
              >
                Nueva compra
              </TabsTrigger>
            )}

            <TabsTrigger
              className="bg-black text-[#ffffff] font-bold font-onest"
              value="purchase-history"
            >
              Historial
            </TabsTrigger>
            <TabsTrigger
              className="bg-black text-[#ffffff] font-bold font-onest"
              value="return-history"
            >
              Devoluciones
            </TabsTrigger>
          </TabsList>
        </div>
        {access.create && (
          <TabsContent value="purchase">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 h-[36rem] max-h-[36rem]">
              <Purchase
                productSale={productSale}
                setProductSale={setProductSale}
              />
              <PurchaseCashier
                productSale={productSale}
                setProductSale={setProductSale}
              />
            </div>
          </TabsContent>
        )}
        <TabsContent value="purchase-history">
          <PurchaseHistory />
        </TabsContent>
        <TabsContent value="return-history">
          <ReturnHistory type={ITypeTransaction.COMPRA} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
