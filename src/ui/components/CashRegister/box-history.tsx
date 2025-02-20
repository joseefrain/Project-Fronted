import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ICajaBrach } from '../../../app/slices/cashRegisterSlice';
import { DateRange } from 'react-day-picker';
import { useRoleAccess } from '../../../shared/hooks/useRoleAccess';
import { PAGES_MODULES } from '../../../shared/helpers/roleHelper';
import { ViewHistorialcashier } from './history/tabs';

interface ICajaHistory {
  data: ICajaBrach;
  isOpen: boolean;
  onClose: () => void;
}

export const ModalHistory = ({ data, isOpen, onClose }: ICajaHistory) => {
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >(undefined);
  const [currentPage, setCurrentPage] = useState(1);

  const access = useRoleAccess(PAGES_MODULES.PRODUCTOS);
  const filteredHistorico = selectedDateRange
    ? data.historico.filter((entry) => {
        const aperturaDate = new Date(entry.fechaApertura);
        return (
          aperturaDate >= (selectedDateRange.from ?? new Date(0)) &&
          aperturaDate <= (selectedDateRange.to ?? new Date())
        );
      })
    : data.historico;

  const handleDateRangeSelect = (dateRange: DateRange) => {
    setSelectedDateRange(dateRange);
    console.log(dateRange);
  };

  if (!data) return null;

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistorico.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const paginatedData = Math.ceil(filteredHistorico.length / itemsPerPage);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-[480px]:w-[95%]">
          <DialogHeader className=" max-w-4xl max-[480px]:w-[47%] max-[768px]:w-[94%]">
            <DialogTitle>Historial de Caja # {data.consecutivo}</DialogTitle>
            <ViewHistorialcashier
              data={data}
              currentItems={currentItems}
              isOpen={isOpen}
              onClose={onClose}
              access={access}
              currentPage={currentPage}
              totalPages={paginatedData}
              onPageChange={setCurrentPage}
              handleDateRangeSelect={handleDateRangeSelect}
              selectedDateRange={selectedDateRange}
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
