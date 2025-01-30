import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MainCredits } from '../../../../ui/components/Credits/main';

export const Credits = () => {
  return (
    <div className="container mx-auto">
      <Tabs defaultValue="all">
        <div className="flex flex-col items-center justify-between gap-4 mb-3 sm:flex-row sm:items-center">
          <h1 className="text-4xl font-bold text-gray-800 font-onest dark:text-white">
            Créditos
          </h1>
          <TabsList className="gap-4 font-bold text-white bg-black font-onest">
            <TabsTrigger
              className="bg-black text-[#ffffff] font-bold"
              value="all"
            >
              Todos
            </TabsTrigger>
            <TabsTrigger
              className="text-[#ffffff] font-bold border-b-2 border-bg-gray-200 border-opacity-0 bg-black"
              value="plazos"
            >
              Plazos
            </TabsTrigger>
            <TabsTrigger
              className="bg-black text-[#ffffff] font-bold"
              value="pagos"
            >
              Pagos
            </TabsTrigger>
            <TabsTrigger
              className="bg-black text-[#ffffff] font-bold"
              value="historial"
            >
              Historial
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="all">
          <MainCredits filterType="all" />
        </TabsContent>
        <TabsContent value="plazos">
          <MainCredits filterType="plazo" />
        </TabsContent>
        <TabsContent value="pagos">
          <MainCredits filterType="pago" />
        </TabsContent>
        <TabsContent value="historial">
          <MainCredits filterType="historial" />
        </TabsContent>
      </Tabs>
    </div>
  );
};
