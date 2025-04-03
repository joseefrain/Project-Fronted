import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { store } from '../../../app/store';
import { useAppSelector } from '@/app/hooks';
import { getchartsProducts } from '../../../app/slices/dashboardSlice';
import { formatNumber } from '../../../shared/helpers/Branchs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '../../../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { IResponseGetProductMetrics } from '../../../interfaces/dashboardInterface';
import './styles.scss';
import Pagination from '../../../shared/components/ui/Pagination/Pagination';

export default function DashboardProducts() {
  const [activeTab, setActiveTab] = useState<'venta' | 'compra'>('venta');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [productFilter, setProductFilter] = useState('all');
  const userIDBranch = useAppSelector(
    (state) => state.auth.signIn.user?.sucursalId?._id
  );
  const dataDashboard = useAppSelector((state) => state.dashboard.data);
  const formatearFecha = (fecha: Date) => format(fecha, 'dd-MM-yyyy');
  const [errorBE, setErrorBE] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fechaInicio = dateRange?.from
      ? formatearFecha(dateRange.from)
      : formatearFecha(new Date());
    const fechaFin = dateRange?.to
      ? formatearFecha(dateRange.to)
      : formatearFecha(new Date());

    const fetchData = async () => {
      if (userIDBranch) {
        const dashboardData = { id: userIDBranch, fechaInicio, fechaFin };
        setLoading(true);
        try {
          await store.dispatch(getchartsProducts(dashboardData)).unwrap();
          setErrorBE(null);
        } catch (error) {
          setErrorBE(error as string);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [dateRange, userIDBranch]);

  const currentData =
    (dataDashboard?.[activeTab] as IResponseGetProductMetrics['venta']) || {};

  const showError =
    !loading && (errorBE || !currentData?.listaProductos?.length);

  const card1Title =
    activeTab === 'venta'
      ? 'Producto Más Vendido'
      : 'Producto con Mayor Cantidad Comprada';
  const card2Title =
    activeTab === 'venta' ? 'Mayor Venta Total' : 'Mayor Compra Total';
  const card3Title = 'Mayor Ganancia Neta';
  const card4Title =
    activeTab === 'venta'
      ? 'Total de Ventas Globales'
      : 'Total de Compras Globales';
  const card5Title =
    activeTab === 'venta'
      ? 'Total Ganancia Neta Bruto'
      : 'Total Ganancia Neta Bruto';
  const dataNT =
    activeTab === 'venta'
      ? dataDashboard?.totalSalesBranch
      : dataDashboard?.totalBuyBranch;
  const dataNTP =
    activeTab === 'venta'
      ? dataDashboard?.totalSaleProfitBranch
      : dataDashboard?.totalBuyProfitBranch;
  const {
    productoMayorCantidad,
    productoMayorTotal,
    productoMayorGanancia,
    listaProductos,
  } = currentData || {};

  const sortedProductos = [...(listaProductos || [])].sort((a, b) => {
    if (productFilter === 'highest')
      return (
        Number(b.gananciaNeta.$numberDecimal) -
        Number(a.gananciaNeta.$numberDecimal)
      );
    if (productFilter === 'lowest')
      return (
        Number(a.gananciaNeta.$numberDecimal) -
        Number(b.gananciaNeta.$numberDecimal)
      );
    return 0;
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [toolsPerPage] = useState(10);

  const indexOfLastItem = currentPage * toolsPerPage;
  const indexOfFirstItem = indexOfLastItem - toolsPerPage;
  const currentItems = sortedProductos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedProductos.length / toolsPerPage);

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 font-onest">
      <motion.h1
        className="text-4xl font-bold mb-8 text-gray-800 dark:text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Dashboard
      </motion.h1>
      <div className="mb-6 flex space-x-4 max-sm:justify-center">
        <Button
          variant={activeTab === 'venta' ? 'default' : 'outline'}
          onClick={() => setActiveTab('venta')}
        >
          Ventas
        </Button>
        <Button
          variant={activeTab === 'compra' ? 'default' : 'outline'}
          onClick={() => setActiveTab('compra')}
        >
          Compras
        </Button>
      </div>
      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card1Title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold w-64 truncate">
                {productoMayorCantidad?.producto || ''}
              </div>
              <div className=" flex gap-1 items-center">
                <div className="flex gap-1 text-xs text-muted-foreground">
                  Cantidad:{' '}
                  <p className="text-black dark:text-white  text-xs font-semibold">
                    C$
                    {productoMayorCantidad?.cantidad || 0}
                  </p>{' '}
                </div>
                <div className="flex gap-1 text-xs text-muted-foreground">
                  | Total:
                  <p className="text-black dark:text-white  text-xs font-semibold">
                    C${' '}
                    {formatNumber(
                      productoMayorCantidad?.total?.$numberDecimal || 0
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card2Title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold w-64 truncate">
                {productoMayorTotal?.producto || ''}
              </div>
              <p className="text-xs text-muted-foreground flex gap-1">
                Total:
                <p className="text-black dark:text-white  text-xs font-semibold">
                  C$
                  {formatNumber(productoMayorTotal?.total?.$numberDecimal || 0)}
                </p>
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card3Title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold w-64 truncate">
                {productoMayorGanancia?.producto || ''}
              </div>
              <div className="flex items-center gap-1">
                <p className="text-xs text-muted-foreground ">Ganancia:</p>
                <span className="text-black dark:text-white  text-xs font-semibold">
                  C$
                  {formatNumber(
                    productoMayorGanancia?.gananciaNeta?.$numberDecimal || 0
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card5Title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  C$
                  {formatNumber(dataNTP?.$numberDecimal || 0)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card4Title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  C$
                  {formatNumber(dataNT?.$numberDecimal || 0)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader className="container-DashboardTable">
            <CardTitle>
              Detalles de Productos
              {activeTab === 'venta' ? ' Ventas' : ' Compras'}
            </CardTitle>
            <div className="container-DashboardTable__container">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {dateRange?.from && dateRange?.to
                      ? `${format(dateRange.from, 'dd/MM/yyyy', { locale: es })} - ${format(dateRange.to, 'dd/MM/yyyy', { locale: es })}`
                      : 'Seleccionar Fechas'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CalendarComponent
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
              <Select onValueChange={setProductFilter} defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por total" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los productos</SelectItem>
                  <SelectItem value="highest">Mayor total</SelectItem>
                  <SelectItem value="lowest">Menor total</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Total de Costo</TableHead>
                  <TableHead>Costo Unitario</TableHead>
                  <TableHead>
                    {activeTab === 'venta'
                      ? 'Ventas Totales'
                      : 'Compras Totales'}
                  </TableHead>
                  <TableHead>Ganancia Neta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {showError ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center">
                      <h1 className="text-lg text-gray-400 dark:text-white font-onest">
                        {errorBE ||
                          'No hay datos disponibles para las fechas seleccionadas'}
                      </h1>
                    </td>
                  </tr>
                ) : (
                  currentItems.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {product.nombre}
                      </TableCell>
                      <TableCell>{product.cantidad}</TableCell>
                      <TableCell>
                        C$ {formatNumber(product.precio.$numberDecimal)}
                      </TableCell>
                      <TableCell>
                        C$ {formatNumber(product.totalCosto.$numberDecimal)}
                      </TableCell>
                      <TableCell>
                        C$ {formatNumber(product.costoUnitario.$numberDecimal)}
                      </TableCell>
                      <TableCell>
                        C$ {formatNumber(product.total.$numberDecimal)}
                      </TableCell>
                      <TableCell>
                        C$ {formatNumber(product.gananciaNeta.$numberDecimal)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
          <div className="flex p-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
