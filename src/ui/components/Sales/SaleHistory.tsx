import { useAppSelector } from '@/app/hooks';
import { getSalesByBranch } from '@/app/slices/salesSlice';
import { store } from '@/app/store';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getFormatedDate } from '@/shared/helpers/transferHelper';
import { Eye, History, ShoppingBasket } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getSelectedBranchFromLocalStorage } from '../../../shared/helpers/branchHelpers';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui/popover';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import Pagination from '../../../shared/components/ui/Pagination/Pagination';
import { SaleReturnContainer } from './SaleReturnContainer';
import { dataCoins, ISale } from '../../../interfaces/salesInterfaces';
import { ExportToExcel } from '../../../shared/components/ui/ExportToExcel/ExportToExcel';
import { formatNumber } from '../../../shared/helpers/Branchs';
import { SearchComponent } from '../../../shared/components/ui/Search';
import { PAGES_MODULES } from '../../../shared/helpers/roleHelper';
import { useRoleAccess } from '../../../shared/hooks/useRoleAccess';

export const SaleHistory = () => {
  const branchStoraged = getSelectedBranchFromLocalStorage();
  const user = useAppSelector((state) => state.auth.signIn.user);
  const access = useRoleAccess(PAGES_MODULES.CONTACTOS);
  const salesHistory = useAppSelector((state) => state.sales.branchSales);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const coin = dataCoins.currentS;
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    store
      .dispatch(getSalesByBranch(user?.sucursalId?._id ?? branchStoraged ?? ''))
      .unwrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >(undefined);

  const filteredSalesRange = selectedDateRange
    ? salesHistory.filter((entry) => {
        const aperturaDate = entry.fechaRegistro
          ? new Date(entry.fechaRegistro)
          : new Date();
        return (
          aperturaDate >= (selectedDateRange.from ?? new Date(0)) &&
          aperturaDate <= (selectedDateRange.to ?? new Date())
        );
      })
    : salesHistory;

  const handleDateRangeSelect = (dateRange: DateRange) => {
    setSelectedDateRange(dateRange);
  };

  const filteredSales = filteredSalesRange?.filter((sale) =>
    sale?.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSales.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

  const columns: { key: keyof ISale; label: string }[] = [
    { key: 'fechaRegistro', label: 'Fecha' },
    { key: 'username', label: 'Usuario' },
    { key: 'subtotal', label: 'Subtotal' },
    { key: 'total', label: 'Total' },
    { key: 'monto', label: 'Monto' },
    { key: 'montoExterno', label: 'Monto externo' },
    { key: 'paymentMethod', label: 'Método de pago' },
    { key: 'tipoTransaccion', label: 'Tipo de transacción' },
  ];

  const formattedProducts = salesHistory?.map((product: any) => ({
    ...product,
  }));

  const totalCosto = salesHistory?.reduce((acc, product) => {
    return acc + Number(product.total);
  }, 0);

  const dateToday = new Date();
  const fileName = ` ${getFormatedDate(dateToday)}-Registros de ventas.xlsx`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History />
          Historial de ventas
        </CardTitle>
        <CardDescription>
          Ver los detalles de las ventas realizadas
        </CardDescription>

        <div className="container-temp">
          <div className="flex items-center justify-between ">
            <SearchComponent
              searchTerm={searchTerm}
              placeholder="Buscar productos"
              setSearchTerm={setSearchTerm}
            />
          </div>
          <div className="container-tempinto">
            <div className="flex justify-end mb-4">
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
            </div>
            {(access.update || access.delete) && (
              <ExportToExcel
                data={formattedProducts || []}
                columns={columns}
                filename={fileName}
                totalRow={{
                  label: 'Total de Ventas',
                  value: formatNumber(totalCosto),
                }}
              />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="min-w-[768px]">
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead>Descuento</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((sale) => (
                <TableRow key={sale.id} className="h-[50px]">
                  <TableCell>{sale.username}</TableCell>
                  <TableCell>
                    {sale.fechaRegistro
                      ? getFormatedDate(sale.fechaRegistro)
                      : 'N/A'}
                  </TableCell>
                  <TableCell>${sale.subtotal.toFixed(2)}</TableCell>
                  <TableCell>${sale.discount.toFixed(2)}</TableCell>
                  <TableCell>${sale.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="font-onest max-w-3xl rounded-[4px] min-h-[12.5rem]">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2 uppercase">
                            <ShoppingBasket />
                            Productos
                          </DialogTitle>
                        </DialogHeader>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Producto</TableHead>
                              <TableHead className="text-center">
                                Tipo de cliente
                              </TableHead>
                              <TableHead className="text-center">
                                Cantidad
                              </TableHead>
                              <TableHead className="text-center">
                                Precio
                              </TableHead>
                              <TableHead className="text-center">
                                Descuento
                              </TableHead>
                              <TableHead className="text-center">
                                Total
                              </TableHead>
                            </TableRow>
                          </TableHeader>

                          <TableBody>
                            {sale.products.map((item) => (
                              <TableRow key={item.productId}>
                                <TableCell>{item.productName}</TableCell>
                                <TableCell className="text-center">
                                  {item.clientType}
                                </TableCell>
                                <TableCell className="text-center">
                                  {item.quantity}
                                </TableCell>
                                <TableCell className="text-center">
                                  {coin}
                                  {item.price.toFixed(2)}
                                </TableCell>
                                <TableCell className="text-center">
                                  {item.discount &&
                                  item.discount?.amount > 0 ? (
                                    <span className="text-green-600">
                                      {coin}
                                      {item.discount.amount.toFixed(2)}{' '}
                                    </span>
                                  ) : (
                                    '-'
                                  )}
                                </TableCell>
                                <TableCell className="text-center">
                                  {coin}
                                  {(
                                    item.quantity * item.price -
                                    (item.discount?.amount ?? 0)
                                  ).toFixed(2)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell className="text-center">
                    <SaleReturnContainer sale={sale} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </CardFooter>
    </Card>
  );
};
