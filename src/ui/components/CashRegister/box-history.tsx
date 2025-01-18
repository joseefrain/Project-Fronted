import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '../../../components/ui/button';
import { ICajaBrach } from '../../../app/slices/cashRegisterSlice';
import { DateRange } from 'react-day-picker';

interface ICajaHistory {
  data: ICajaBrach;
  isOpen: boolean;
  onClose: () => void;
}

export const ModalHistory = ({ data, isOpen, onClose }: ICajaHistory) => {
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >(undefined);

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
  };

  if (!data) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Historial de Caja # {data.consecutivo}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-end mb-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  {selectedDateRange
                    ? `${
                        selectedDateRange.from &&
                        !isNaN(selectedDateRange.from.getTime())
                          ? format(selectedDateRange.from, 'P', { locale: es })
                          : ''
                      } - 
                        ${
                          selectedDateRange.to &&
                          !isNaN(selectedDateRange.to.getTime())
                            ? format(selectedDateRange.to, 'P', { locale: es })
                            : ''
                        }`
                    : 'Seleccionar Fechas'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  selected={selectedDateRange}
                  onSelect={(dateRange) =>
                    dateRange && handleDateRangeSelect(dateRange)
                  }
                  mode="range"
                  numberOfMonths={2}
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-center">Monto Inicial</TableHead>
                <TableHead className="text-center">Diferencia</TableHead>
                <TableHead className="text-center">Monto Esperado</TableHead>
                <TableHead className="text-center">Monto Final</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistorico.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {format(new Date(entry.fechaApertura), 'P', { locale: es })}
                  </TableCell>
                  <TableCell className="text-center">
                    $
                    {parseFloat(
                      entry.montoInicial?.$numberDecimal?.toString() ?? '0'
                    ).toLocaleString('es-ES')}
                  </TableCell>
                  <TableCell className="text-center">
                    ${/* @ts-ignore */}
                    {entry.diferencia?.$numberDecimal?.toString()}
                  </TableCell>
                  <TableCell className="text-center">
                    $
                    {parseFloat(
                      entry.montoEsperado?.$numberDecimal?.toString() ?? '0'
                    ).toLocaleString('es-ES')}
                  </TableCell>
                  <TableCell className="text-center">
                    ${/* @ts-ignore */}
                    {entry.montoFinalDeclarado?.$numberDecimal?.toString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </>
  );
};
