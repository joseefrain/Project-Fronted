import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { useAppSelector } from '../../../app/hooks';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { getchartsReturnsMetrics } from '../../../app/slices/dashboardSlice';
import { store } from '../../../app/store';
import { format } from 'date-fns';
import { formatNumber } from '../../../shared/helpers/Branchs';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui/popover';
import { Button } from '../../../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { es } from 'date-fns/locale';
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';

const COLORS = ['#4284d7', '#6B7280', '#9CA3AF', '#D1D5DB'];
type ReturnType = 'VENTA' | 'COMPRA';

const DashboardTab = ({ type }: { type: ReturnType }) => {
  const data = useAppSelector((state) => state.dashboard.returns?.[type]);
  const userIDBranch = useAppSelector(
    (state) => state.auth.signIn.user?.sucursalId?._id
  );
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [errorBE, setErrorBE] = useState<string | null>(null);
  const [productFilter, setProductFilter] = useState('all');
  const showError = !loading && (errorBE || !data?.listProduct?.length);

  useEffect(() => {
    if (!userIDBranch) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        await store
          .dispatch(
            getchartsReturnsMetrics({
              id: userIDBranch,
              fechaInicio: format(dateRange?.from || new Date(), 'dd-MM-yyyy'),
              fechaFin: format(dateRange?.to || new Date(), 'dd-MM-yyyy'),
            })
          )
          .unwrap();
        setErrorBE(null);
      } catch (error) {
        setErrorBE(error as string);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dateRange, userIDBranch]);

  if (!data) return null;

  const pieChartData = data?.listProduct.map((p) => {
    const totalDecimal = p.total?.$numberDecimal;
    const costoDecimal = p.costoUnitario?.$numberDecimal;
    const gananciaDecimal = p.gananciaNeta?.$numberDecimal;

    return {
      name: p.nombre,
      totalCharts: totalDecimal ? Number(totalDecimal) : 0,
      total: totalDecimal ? Number(totalDecimal) : 0,
      costoUnitario: costoDecimal ? formatNumber(costoDecimal) : '0',
      gananciaNeta: gananciaDecimal ? formatNumber(gananciaDecimal) : '0',
      cantidad: p.cantidad ?? 0,
      _id: p.productoId,
    };
  });

  const sortedProductos = [...(pieChartData || [])].sort((a, b) => {
    if (productFilter === 'highest')
      return Number(b.gananciaNeta) - Number(a.gananciaNeta);
    if (productFilter === 'lowest')
      return Number(a.gananciaNeta) - Number(b.gananciaNeta);
    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Devoluciones de {type}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Monto Devuelto</p>
                <p className="text-3xl font-bold">
                  C$ {formatNumber(data.amountReturned.$numberDecimal || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Cantidad Devuelta
                </p>
                <p className="text-3xl font-bold">{data.quantityReturned}</p>
              </div>
              <div
                className={`flex items-center ${type === 'VENTA' ? 'text-red-500' : 'text-green-500'}`}
              >
                {type === 'VENTA' ? (
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                )}
                {type === 'VENTA'
                  ? 'Impacto negativo en ganancias'
                  : 'Impacto positivo en ganancias'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monto Total por Producto</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={pieChartData.map((p) => ({
                  name:
                    p.name.length > 15 ? `${p.name.slice(0, 12)}...` : p.name,
                  total: Number(p.total),
                }))}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <YAxis dataKey="name" type="category" width={80} hide />
                <XAxis type="number" hide />
                <Tooltip cursor={{ fill: 'rgba(755, 288, 255, 0.1)' }} />
                <Bar dataKey="total" fill="#4f46e5" radius={8}>
                  <LabelList
                    dataKey="name"
                    offset={10}
                    position="insideLeft"
                    className="fill-white text-xs"
                  />
                  <LabelList
                    offset={10}
                    dataKey="total"
                    position="center"
                    className="fill-foreground hidden"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cantidad por Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData.map((p) => ({
                    name: p.name.slice(0, 15),
                    cantidad: p.cantidad,
                    value: formatNumber(p.total),
                  }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="cantidad"
                  labelLine={false}
                  label={false}
                >
                  {pieChartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Detalles de Productos Devueltos</CardTitle>
            <div className="flex flex-row items-center justify-between gap-4">
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
            <div className="overflow-x-auto">
              <Table className="w-full text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead className="px-6 py-3 text-left">Total</TableHead>
                    <TableHead className="px-6 py-3 text-left">
                      Costo Unitario
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left">
                      Ganancia Neta
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <tbody>
                  {showError ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center">
                        <h1 className="text-lg text-gray-400 dark:text-white font-onest">
                          {errorBE ||
                            'No hay datos disponibles para las fechas seleccionadas'}
                        </h1>
                      </td>
                    </tr>
                  ) : (
                    sortedProductos?.map((p) => (
                      <TableRow key={p._id}>
                        <TableCell className="px-6 py-4">{p.name}</TableCell>
                        <TableCell className="px-6 py-4">
                          {p.cantidad}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          C${formatNumber(p.total)}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          C${p.costoUnitario}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          C${p.gananciaNeta}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const DashboardDevoluciones = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-950 font-onest">
      <h1 className="text-4xl font-bold mb-8">Dashboard de Devoluciones</h1>
      <Tabs defaultValue="VENTA" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="VENTA">Devoluciones de Venta</TabsTrigger>
          <TabsTrigger value="COMPRA">Devoluciones de Compra</TabsTrigger>
        </TabsList>
        <TabsContent value="VENTA">
          <DashboardTab type="VENTA" />
        </TabsContent>
        <TabsContent value="COMPRA">
          <DashboardTab type="COMPRA" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardDevoluciones;
