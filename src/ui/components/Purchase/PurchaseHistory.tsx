import { useAppSelector } from '@/app/hooks';
import { getPurchasesByBranch } from '@/app/slices/salesSlice';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui/popover';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { getFormatedDate } from '@/shared/helpers/transferHelper';
import { Eye, History, ShoppingBasket } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getSelectedBranchFromLocalStorage } from '../../../shared/helpers/branchHelpers';
import { DateRange } from 'react-day-picker';
import Pagination from '../../../shared/components/ui/Pagination/Pagination';
import { dataCoins } from '../../../interfaces/salesInterfaces';
import { SaleReturnContainer } from '../Sales/SaleReturnContainer';
import { SearchComponent } from '../../../shared/components/ui/Search';

export const PurchaseHistory = () => {
  const user = useAppSelector((state) => state.auth.signIn.user);
  const branchStoraged = getSelectedBranchFromLocalStorage();
  const purchasesHistory = useAppSelector(
    (state) => state.sales.branchPurchases
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const coin = dataCoins.currentS;

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    store
      .dispatch(
        getPurchasesByBranch(user?.sucursalId?._id ?? branchStoraged ?? '')
      )
      .unwrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >(undefined);

  const filteredSalesRange = selectedDateRange
    ? purchasesHistory.filter((entry) => {
        const aperturaDate = entry.fechaRegistro
          ? new Date(entry.fechaRegistro)
          : new Date();
        return (
          aperturaDate >= (selectedDateRange.from ?? new Date(0)) &&
          aperturaDate <= (selectedDateRange.to ?? new Date())
        );
      })
    : purchasesHistory;

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History />
          Historial de compras
        </CardTitle>
        <CardDescription>
          Ver los detalles de las compras realizadas
        </CardDescription>
        <div className="flex justify-between mb-4">
          <div className="flex items-center pt-4">
            <SearchComponent
              searchTerm={searchTerm}
              placeholder="Buscar productos"
              setSearchTerm={setSearchTerm}
            />
          </div>
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
              {currentItems.map((sale, index) => (
                <TableRow key={index} className="h-[50px]">
                  <TableCell>{sale.username}</TableCell>
                  <TableCell>
                    {' '}
                    {sale.fechaRegistro
                      ? getFormatedDate(sale.fechaRegistro)
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {coin}
                    {sale.subtotal.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {coin}
                    {sale.discount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {coin}
                    {sale.total.toFixed(2)}
                  </TableCell>
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
                        <div className="overflow-x-auto">
                          <Table className="min-w-[768px]">
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
                                        {(
                                          item.quantity * item.discount.amount
                                        ).toFixed(2)}{' '}
                                      </span>
                                    ) : (
                                      '-'
                                    )}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {coin}
                                    {(
                                      item.price * item.quantity -
                                      (item.discount?.amount || 0) *
                                        item.quantity
                                    ).toFixed(2)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
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
