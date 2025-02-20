import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../app/hooks';
import {
  getHistoryCashiers,
  ICajaBrach,
} from '../../../../app/slices/cashRegisterSlice';
import { store } from '../../../../app/store';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IRoleAccess } from '../../../../interfaces/roleInterfaces';
import { CardFooter } from '../../../../components/ui/card';
import Pagination from '../../../../shared/components/ui/Pagination/Pagination';
import { getFormatedDate } from '../../../../shared/helpers/transferHelper';
import { ExportToExcel } from '../../../../shared/components/ui/ExportToExcel/ExportToExcel';
import { DateRange } from 'react-day-picker';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../../components/ui/popover';
import { Button } from '../../../../components/ui/button';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface IHistoryCahier {
  data: ICajaBrach;
  access: IRoleAccess;
}

export const HistoryCahierCount = ({ data, access }: IHistoryCahier) => {
  const dataHisotry =
    useAppSelector((state) => state.boxes.historyCashier) || [];
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >(undefined);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    store.dispatch(getHistoryCashiers(data._id as string)).unwrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredSalesRange = selectedDateRange
    ? dataHisotry.filter((entry) => {
        const aperturaDate = entry.fecha ? new Date(entry.fecha) : new Date();
        return (
          aperturaDate >= (selectedDateRange.from ?? new Date(0)) &&
          aperturaDate <= (selectedDateRange.to ?? new Date())
        );
      })
    : dataHisotry;

  const handleDateRangeSelect = (dateRange: DateRange) => {
    setSelectedDateRange(dateRange);
  };

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSalesRange?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const paginatedData = Math.ceil(filteredSalesRange.length / itemsPerPage);

  const consecutivo = data.consecutivo;
  const columns: { key: string; label: string }[] = [
    { key: 'fecha', label: 'Fecha' },
    { key: 'consecutivo', label: 'Numero de caja' },
    { key: 'totalVentas', label: ' Total Ventas' },
    { key: 'totalCompras', label: 'Total Compras' },
    { key: 'montoFinalSistema', label: 'Monto Final' },
    { key: 'compras', label: 'Compras' },
    { key: 'ventas', label: 'Ventas' },
  ];

  const formattedProducts = dataHisotry?.map((product: any) => ({
    ...product,
    fecha: product.fecha
      ? getFormatedDate(
          new Date(
            new Date(product.fecha).setDate(
              new Date(product.fecha).getDate() + 1
            )
          )
        )
      : 'N/A',
    consecutivo: consecutivo ?? '',
    totalVentas: product?.totalVentas?.$numberDecimal,
    totalCompras: product?.totalCompras?.$numberDecimal,
    montoFinalSistema: product?.montoFinalSistema?.$numberDecimal,
    compras: product?.compras?.length,
    ventas: product?.ventas?.length,
  }));

  const dateToday = new Date();
  const fileName = ` ${getFormatedDate(dateToday)}-Registros de cajas Arqueo.xlsx`;

  return (
    <>
      <div>
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
                          ? format(selectedDateRange.from, 'P', {
                              locale: es,
                            })
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
                //   totalRow={{
                //     label: 'Total de monto',
                //     value: formatNumber(totalCosto),
                //   }}
              />
            )}
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-center">Total Ventas</TableHead>
              {(access.update || access.delete) && (
                <>
                  <TableHead className="text-center">Total Compras</TableHead>
                  <TableHead className="text-center">Monto Esperado</TableHead>
                </>
              )}
              <TableHead className="text-center">Compras</TableHead>
              <TableHead className="text-center">Ventas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems?.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>
                  {entry.fecha
                    ? getFormatedDate(
                        new Date(
                          new Date(entry.fecha).setDate(
                            new Date(entry.fecha).getDate() + 1
                          )
                        )
                      )
                    : 'N/A'}
                </TableCell>
                <TableCell className="text-center">
                  C$
                  {entry.totalVentas?.$numberDecimal?.toString()}
                </TableCell>
                <TableCell className="text-center">
                  C$
                  {entry.totalCompras?.$numberDecimal?.toString()}
                </TableCell>
                <TableCell className="text-center">
                  C$
                  {entry.montoFinalSistema?.$numberDecimal?.toString()}
                </TableCell>
                <TableCell className="text-center">
                  {entry.compras.length}
                </TableCell>
                <TableCell className="text-center">
                  {entry.ventas.length}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <CardFooter className="flex items-center justify-between pt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={paginatedData}
            onPageChange={setCurrentPage}
          />
        </CardFooter>
      </div>
    </>
  );
};
