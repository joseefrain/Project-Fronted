import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MainContacts } from '../../../../ui/components/clients/main';

export const ViewEntities = () => {
  return (
    <div className="container mx-auto">
      <Tabs defaultValue="listContacts">
        <div className="flex flex-col items-center justify-between gap-4 mb-3 sm:flex-row sm:items-center">
          <h1 className="text-4xl font-bold text-gray-800 font-onest">
            Contactos
          </h1>
          <TabsList className="gap-4 font-bold text-white bg-black font-onest">
            <TabsTrigger
              className="text-[#ffffff] font-bold border-b-2 border-bg-gray-200 border-opacity-0 bg-black"
              value="listContacts"
            >
              Contactos
            </TabsTrigger>
            <TabsTrigger
              className="bg-black text-[#ffffff] font-bold"
              value="listSuppliers"
            >
              Proveedores
            </TabsTrigger>
            <TabsTrigger
              className="bg-black text-[#ffffff] font-bold"
              value="listCustomers"
            >
              Clientes
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="listContacts">
          <MainContacts filterType="contact" />
        </TabsContent>
        <TabsContent value="listSuppliers">
          <MainContacts filterType="supplier" />
        </TabsContent>
        <TabsContent value="listCustomers">
          <MainContacts filterType="customer" />
        </TabsContent>
      </Tabs>
    </div>
  );
};
