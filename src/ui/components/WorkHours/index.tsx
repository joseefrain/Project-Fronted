import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '../../../app/hooks';
import {
  getRecordedHoursPatch,
  updateRecordedHoursPatch,
} from '../../../app/slices/workHours';
import { store } from '../../../app/store';
import { getFormatedDate } from '../../../shared/helpers/transferHelper';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import './styles.scss';

const militaryToStandardTime = (isoTime: string) => {
  const date = new Date(isoTime);
  if (isNaN(date.getTime())) return '-';
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const suffix = hours < 12 ? 'AM' : 'PM';
  const standardHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

  return `${standardHours}:${minutes.toString().padStart(2, '0')} ${suffix}`;
};

export default function PageWorkHours() {
  const user = useAppSelector((state) => state.auth.signIn.user);
  const dataWorkHours = useAppSelector(
    (state) => state.workHours.recordedHours
  );

  const _hoursInitDay = dataWorkHours?.map((employee) =>
    militaryToStandardTime(employee?.startWork)
  );

  const _hoursEndDay = dataWorkHours?.map((employee) =>
    militaryToStandardTime(employee?.endWork)
  );

  const [editing, setEditing] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string>('');
  const [checkOutTime, setCheckOutTime] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const formatearFecha = (fecha: Date) => format(fecha, 'dd-MM-yyyy');
  const [errorBE, setErrorBE] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const today = new Date();
  const returnStartDate = new Date(today);
  const returnEndDate = new Date(today);

  returnStartDate.setDate(returnStartDate.getDate());
  returnEndDate.setDate(returnEndDate.getDate());

  const showError = !loading && (errorBE || !dataWorkHours?.length);

  useEffect(() => {
    const fechaInicio = dateRange?.from
      ? formatearFecha(dateRange.from)
      : formatearFecha(new Date());
    const fechaFin = dateRange?.to
      ? formatearFecha(dateRange.to)
      : formatearFecha(new Date());

    const fetchData = async () => {
      if (user?.sucursalId?._id ?? '') {
        const dataSend = {
          sucursalId: user?.sucursalId?._id ?? '',
          startDate: fechaInicio,
          endDate: fechaFin,
        };
        setLoading(true);
        try {
          await store.dispatch(getRecordedHoursPatch(dataSend)).unwrap();
          setErrorBE(null);
        } catch (error) {
          setErrorBE(error as string);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, user?.sucursalId?._id ?? '']);

  const formatToTimeInput = (dateString: string) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    if (dataWorkHours?.length) {
      setCheckInTime(formatToTimeInput(_hoursInitDay?.[0] || ''));
      setCheckOutTime(formatToTimeInput(_hoursEndDay?.[0] || ''));
    }
  }, [dataWorkHours]);

  const formatToLocalTimeString = (time: string) => {
    if (!time) return '';

    const date = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    date.setHours(hours, minutes, 0, 0);

    return date.toString();
  };

  const handleSaveChanges = async () => {
    try {
      await store.dispatch(
        updateRecordedHoursPatch({
          sucursalId: user?.sucursalId?._id ?? '',
          startWork: formatToLocalTimeString(checkInTime),
          endWork: formatToLocalTimeString(checkOutTime),
        })
      );
      setEditing(false);
    } catch (error) {
      toast.error('Error al actualizar el horario: ' + error);
    }
  };

  return (
    <div className="container-WorkHours__main">
      <div className="max-w-7xl mx-auto space-y-8">
        <span className="text-3xl font-bold">
          Horario de atención de empleados
        </span>

        <div className="container-WorkHours">
          <Card>
            <CardHeader className="text-xl font-semibold mb-4">
              Editar horarios de atención por sucursal
              <div>
                <p className="text-sm text-black dark:text-white font-onest font-bold underline">
                  {_hoursInitDay} a {_hoursEndDay}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="container-WorkHours__inputs">
                <div className="container-WorkHours__inputs__container">
                  <label
                    htmlFor="checkInTime"
                    className="container-WorkHours__inputs__label"
                  >
                    Hora de entrada
                  </label>
                  <Input
                    id="checkInTime"
                    type="time"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    disabled={!editing}
                  />
                </div>

                <div className="container-WorkHours__inputs__container">
                  <label
                    htmlFor="checkOutTime"
                    className="container-WorkHours__inputs__label"
                  >
                    Hora de salida
                  </label>
                  <Input
                    id="checkOutTime"
                    type="time"
                    value={checkOutTime}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                    disabled={!editing}
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center w-full justify-between">
                <div className="flex items-center">
                  <Switch
                    className="p-0"
                    checked={editing}
                    onCheckedChange={setEditing}
                  />
                  <span className="ml-2 font-medium">
                    Habilitar edición global
                  </span>
                </div>

                {editing && (
                  <Button onClick={handleSaveChanges} className="">
                    Guardar cambios
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="container-WorkHours__table">
              <CardTitle className="text-xl font-semibold">
                Registros de atención
              </CardTitle>
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
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Hora de entrada</TableHead>
                    <TableHead>Hora de salida</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
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
                    dataWorkHours?.map((employee) => {
                      return (
                        <TableRow key={employee?._id}>
                          <TableCell>{employee?.userId?.username}</TableCell>
                          <TableCell>{employee?.userId?.role}</TableCell>
                          <TableCell>
                            {getFormatedDate(new Date(employee?.date))}{' '}
                          </TableCell>
                          <TableCell className="text-center">
                            {militaryToStandardTime(employee?.hourEntry)}
                          </TableCell>
                          <TableCell className="text-center">
                            {militaryToStandardTime(employee?.hourExit ?? '')}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
