import {
  ICajaBrach,
  ICajaHistorico,
} from '../../../../app/slices/cashRegisterSlice';
import { IRoleAccess } from '../../../../interfaces/roleInterfaces';
import { DateRange } from 'react-day-picker';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
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
import { Button } from '../../../../components/ui/button';
import { CardFooter } from '../../../../components/ui/card';
import Pagination from '../../../../shared/components/ui/Pagination/Pagination';
import { getFormatedDate } from '../../../../shared/helpers/transferHelper';
import { ExportToExcel } from '../../../../shared/components/ui/ExportToExcel/ExportToExcel';
import { formatNumber } from '../../../../shared/helpers/Branchs';

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

export const HistoryCahier = ({
  access,
  data,
  currentPage,
  totalPages,
  onPageChange,
  handleDateRangeSelect,
  selectedDateRange,
  currentItems,
}: IHistoryCahier) => {
  const cahsHistory = data.historico;
  const consecutivo = data.consecutivo;
  const columns: { key: string; label: string }[] = [
    { key: 'fechaApertura', label: 'Fecha' },
    { key: 'consecutivo', label: 'Numero de caja' },
    { key: 'ganancia', label: 'Ganancia' },
    { key: 'montoInicial', label: 'Monto Inicial' },
    { key: 'montoFinalDeclarado', label: 'Monto Final' },
    { key: 'diferencia', label: 'Diferencia' },
    { key: 'montoEsperado', label: 'Monto Real' },
  ];

  const formattedProducts = cahsHistory?.map((product: any) => ({
    ...product,
    fechaApertura: product.fechaApertura
      ? getFormatedDate(product.fechaApertura)
      : '',
    consecutivo: consecutivo ?? '',
    ganancia: product?.ganancia?.$numberDecimal,
    montoInicial: product?.montoInicial?.$numberDecimal,
    montoFinalDeclarado: product?.montoFinalDeclarado?.$numberDecimal,
    diferencia: product?.diferencia?.$numberDecimal,
    montoEsperado: product?.montoEsperado?.$numberDecimal,
  }));

  const totalCosto = cahsHistory?.reduce((acc, product) => {
    return acc + Number(product.montoEsperado?.$numberDecimal);
  }, 0);

  const dateToday = new Date();
  const fileName = ` ${getFormatedDate(dateToday)}-Registros de cajas.xlsx`;

  return (
    <div>
      <div className="flex justify-end gap-6 mb-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
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
        {(access.update || access.delete) && (
          <ExportToExcel
            data={formattedProducts || []}
            columns={columns}
            filename={fileName}
            totalRow={{
              label: 'Total de monto',
              value: formatNumber(totalCosto),
            }}
          />
        )}
      </div>
      <div className="overflow-x-auto">
        <Table className="min-w-[768px]">
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-center">Monto Inicial</TableHead>
              {(access.update || access.delete) && (
                <>
                  <TableHead className="text-center">Diferencia</TableHead>
                  <TableHead className="text-center">Monto Esperado</TableHead>
                </>
              )}
              <TableHead className="text-center">Monto Final</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((entry, index) => (
              <TableRow key={index} className="h-[50px]">
                <TableCell>
                  {format(new Date(entry.fechaApertura), 'P', { locale: es })}
                </TableCell>
                <TableCell className="text-center">
                  C$
                  {parseFloat(
                    entry.montoInicial?.$numberDecimal?.toString() ?? '0'
                  ).toLocaleString('es-ES')}
                </TableCell>
                <TableCell className="text-center">
                  ${/* @ts-ignore */}
                  {entry.diferencia?.$numberDecimal?.toString()}
                </TableCell>
                <TableCell className="text-center">
                  C$
                  {parseFloat(
                    entry.montoEsperado?.$numberDecimal?.toString() ?? '0'
                  ).toLocaleString('es-ES')}
                </TableCell>
                <TableCell className="text-center">
                  C${/* @ts-ignore */}
                  {entry.montoFinalDeclarado?.$numberDecimal?.toString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CardFooter className="flex items-center justify-between">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </CardFooter>
    </div>
  );
};
