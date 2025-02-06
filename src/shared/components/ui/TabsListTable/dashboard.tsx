import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import './styles.scss';
import DashboardDevoluciones from '../../../../ui/components/Dashboard/returnsDashboard';
import DashboardProducts from '../../../../ui/components/Dashboard';

export const ViewDashboard = () => {
  return (
    <div className="container mx-auto">
      <Tabs defaultValue="prductos">
        <div className="container-TabsListTable ">
          <TabsList className="container-TabsListTable__tabs">
            <TabsTrigger
              className="text-[#ffffff] font-bold border-b-2 border-bg-gray-200 border-opacity-0 bg-black"
              value="prductos"
            >
              Productos
            </TabsTrigger>
            <TabsTrigger
              className="bg-black text-[#ffffff] font-bold"
              value="devoluciones"
            >
              Devoluciones
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="prductos">
          <DashboardProducts />
        </TabsContent>
        <TabsContent value="devoluciones">
          <DashboardDevoluciones />
        </TabsContent>
      </Tabs>
    </div>
  );
};
