import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ICajaBrach,
  ICajaHistorico,
} from '../../../../app/slices/cashRegisterSlice';
import { HistoryCahierCount } from './index2';
import { DateRange } from 'react-day-picker';
import { IRoleAccess } from '../../../../interfaces/roleInterfaces';
import { HistoryCahier } from '.';

interface IHistoryCahier {
  data: ICajaBrach;
  currentItems: ICajaHistorico[];
  isOpen: boolean;
  onClose: () => void;
  access: IRoleAccess;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  handleDateRangeSelect: (dateRange: DateRange) => void;
  selectedDateRange: DateRange | undefined;
}

export const ViewHistorialcashier = ({
  data,
  currentItems,
  isOpen,
  onClose,
  access,
  currentPage,
  totalPages,
  onPageChange,
  handleDateRangeSelect,
  selectedDateRange,
}: IHistoryCahier) => {
  return (
    <div className="container mx-auto">
      <Tabs defaultValue="cajas">
        <div className="container-TabsDasboard">
          <TabsList className="container-TabsDasboard__tabs">
            <TabsTrigger
              className="text-[#ffffff] font-bold border-b-2 border-bg-gray-200 border-opacity-0 bg-black"
              value="cajas"
            >
              Hisorial de cajas
            </TabsTrigger>
            <TabsTrigger
              className="bg-black text-[#ffffff] font-bold"
              value="arqueo"
            >
              Historial de
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="cajas">
          <HistoryCahier
            data={data}
            currentItems={currentItems}
            isOpen={isOpen}
            onClose={onClose}
            access={access}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            handleDateRangeSelect={handleDateRangeSelect}
            selectedDateRange={selectedDateRange}
          />
        </TabsContent>
        <TabsContent value="arqueo">
          <HistoryCahierCount data={data} access={access} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
