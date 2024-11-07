import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ToolShipment from '../../../../ui/components/ToolShipment';
import PendingTools from '@/ui/components/PendingTools';
import { ShippedOrders } from '@/ui/components/BranchShipments';
import { BranchReceived } from '@/ui/components/BranchReceived';

export const HeaderTable = () => {
  return (
    <div className="container mx-auto">
      <Tabs defaultValue="send">
        <div className="flex flex-col items-start justify-center gap-4 mb-7 sm:flex-row sm:items-center">
          <TabsList className="gap-4 font-bold text-white bg-black">
            <TabsTrigger
              className="text-[#ffffff] font-bold border-b-2 border-bg-gray-200 border-opacity-0 bg-black"
              value="send"
            >
              Enviar Productos
            </TabsTrigger>
            <TabsTrigger
              className="bg-black text-[#ffffff] font-bold"
              value="receive"
            >
              Recibir Productos
            </TabsTrigger>
            <TabsTrigger
              className="bg-black text-[#ffffff] font-bold"
              value="branchOrders"
            >
              Recibido Sucursal
            </TabsTrigger>
            <TabsTrigger
              className="bg-black text-[#ffffff] font-bold"
              value="branchShipments"
            >
              Envíos Sucursal
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="receive">
          <PendingTools />
        </TabsContent>
        <TabsContent value="send">
          <ToolShipment />
        </TabsContent>
        <TabsContent value="branchOrders">
          <BranchReceived />
        </TabsContent>
        <TabsContent value="branchShipments">
          <ShippedOrders />
        </TabsContent>
      </Tabs>
    </div>
  );
};
