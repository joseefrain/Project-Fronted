import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BranchReceived } from '@/ui/components/BranchReceived';
import { ShippedOrders } from '@/ui/components/BranchShipments';
import PendingTools from '@/ui/components/PendingTools';
import ToolShipment from '../../../../ui/components/ToolShipment';
import { useRoleAccess } from '../../../hooks/useRoleAccess';
import { PAGES_MODULES } from '../../../helpers/roleHelper';

export const HeaderTable = () => {
  const access = useRoleAccess(PAGES_MODULES.TRASLADOS);

  return (
    <div className="container mx-auto">
      <Tabs defaultValue={access.create ? 'send' : 'branchOrders'}>
        <div className="flex flex-col items-center justify-between gap-4 mb-9 sm:flex-row sm:items-center md:flex-col">
          <h1 className="text-4xl font-bold text-gray-800 font-onest dark:text-white">
            Traslados
          </h1>
          <TabsList className="gap-4 font-bold text-white bg-black font-onest max-md:h-auto max-md:flex-wrap ">
            {access.create && (
              <>
                <TabsTrigger
                  className="text-[#ffffff] font-bold border-b-2 border-bg-gray-200 border-opacity-0 bg-black "
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
              </>
            )}
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

        {access.create && (
          <>
            <TabsContent value="receive">
              <PendingTools />
            </TabsContent>
            <TabsContent value="send">
              <ToolShipment />
            </TabsContent>
          </>
        )}
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
