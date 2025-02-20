import { useAppSelector } from '@/app/hooks';
import { fetchTransactionReturnByBranchId } from '@/app/slices/salesSlice';
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
import {
  dataCoins,
  ISale,
  ITypeTransaction,
} from '../../../interfaces/salesInterfaces';
import { ExportToExcel } from '../../../shared/components/ui/ExportToExcel/ExportToExcel';
import { formatNumber } from '../../../shared/helpers/Branchs';
import { SearchComponent } from '../../../shared/components/ui/Search';
import { PAGES_MODULES } from '../../../shared/helpers/roleHelper';
import { useRoleAccess } from '../../../shared/hooks/useRoleAccess';

export const ReturnHistory = ({ type }: { type: ITypeTransaction }) => {
  const branchStoraged = getSelectedBranchFromLocalStorage();
  const access = useRoleAccess(PAGES_MODULES.CONTACTOS);
  const user = useAppSelector((state) => state.auth.signIn.user);
  const returnHistory = useAppSelector((state) => state.sales.returns);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const coin = dataCoins.currentS;
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    store
      .dispatch(
        fetchTransactionReturnByBranchId({
          id: user?.sucursalId?._id ?? branchStoraged ?? '',
          type: type,
        })
      )
      .unwrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >(undefined);

  const filteredReturnRange = selectedDateRange
    ? returnHistory.filter((entry) => {
        const aperturaDate = entry.fechaRegistro
          ? new Date(entry.fechaRegistro)
          : new Date();
        return (
          aperturaDate >= (selectedDateRange.from ?? new Date(0)) &&
          aperturaDate <= (selectedDateRange.to ?? new Date()) &&
          type === entry.tipoTransaccion
        );
      })
    : returnHistory;

  const handleDateRangeSelect = (dateRange: DateRange) => {
    setSelectedDateRange(dateRange);
  };

  const filteredReturn = filteredReturnRange?.filter((sale) =>
    sale?.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReturn.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReturn.length / itemsPerPage);

  const columns: { key: keyof ISale; label: string }[] = [
    { key: 'fechaRegistro', label: 'Fecha' },
    { key: 'username', label: 'Usuario' },
    { key: 'total', label: 'Total' },
    { key: 'montoExterno', label: 'Monto externo' },
    { key: 'paymentMethod', label: 'Método de pago' },
  ];

  const formattedProducts = returnHistory?.map((product: any) => ({
    ...product,
    fechaRegistro: getFormatedDate(product.fechaRegistro),
  }));

  const totalCosto = returnHistory?.reduce((acc, product) => {
    return acc + Number(product.total);
  }, 0);

  const dateToday = new Date();
  const fileName = ` ${getFormatedDate(dateToday)}-Registros de devoluciones.xlsx`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History />
          Historial de devoluciones
        </CardTitle>
        <CardDescription>
          Ver los detalles de las devoluciones realizadas
        </CardDescription>
        <div className="flex items-baseline justify-between gap-4">
          <div className="flex items-center justify-between ">
            <SearchComponent
              searchTerm={searchTerm}
              placeholder="Buscar productos"
              setSearchTerm={setSearchTerm}
            />
          </div>
          <div className="flex items-baseline justify-between gap-4">
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
            <div>
              {(access.update || access.delete) && (
                <ExportToExcel
                  data={formattedProducts || []}
                  columns={columns}
                  filename={fileName}
                  totalRow={{
                    label: 'Total de Devoluciones',
                    value: formatNumber(totalCosto),
                  }}
                />
              )}
            </div>
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
                <TableHead className="text-center">
                  Dinero extra ingresado
                </TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Productos</TableHead>
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
                  <TableCell className="text-center">
                    $
                    {sale?.montoExterno
                      ? Number(sale?.montoExterno?.$numberDecimal).toFixed(2)
                      : 0}
                  </TableCell>
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
