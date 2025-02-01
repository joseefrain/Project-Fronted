import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IProductSale, ITypeTransaction } from '@/interfaces/salesInterfaces';
import { useState } from 'react';
import { Cashier } from './Inventory';
import { Sale } from './Sale';
import { SaleHistory } from './SaleHistory';
import { useRoleAccess } from '../../../shared/hooks/useRoleAccess';
import { PAGES_MODULES } from '../../../shared/helpers/roleHelper';
import { ReturnHistory } from './ReturnHistory';

export default function SalesInventorySystem() {
  const access = useRoleAccess(PAGES_MODULES.VENTAS);
  const [productSale, setProductSale] = useState<IProductSale[]>([]);

  return (
    <div className="container mx-auto">
      <Tabs defaultValue={access.create ? 'sale' : 'sale-history'}>
        <div className="flex flex-col items-center justify-between gap-4 mb-9 sm:flex-row sm:items-center">
          <h1 className="text-4xl font-bold text-gray-800 font-onest w-[38%] dark:text-white">
            Ventas
          </h1>
          <TabsList className="gap-4 font-bold text-white bg-black">
            {access.create && (
              <TabsTrigger
                className="text-[#ffffff] font-bold border-b-2 border-bg-gray-200 border-opacity-0 bg-black font-onest"
                value="sale"
              >
                Nueva venta
              </TabsTrigger>
            )}
            <TabsTrigger
              className="bg-black text-[#ffffff] font-bold font-onest"
              value="sale-history"
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
          <TabsContent value="sale">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 h-[36rem] max-h-[36rem]">
              <Sale productSale={productSale} setProductSale={setProductSale} />
              <Cashier
                productSale={productSale}
                setProductSale={setProductSale}
              />
            </div>
          </TabsContent>
        )}
        <TabsContent value="sale-history">
          <SaleHistory />
        </TabsContent>
        <TabsContent value="return-history">
          <ReturnHistory type={ITypeTransaction.VENTA} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
