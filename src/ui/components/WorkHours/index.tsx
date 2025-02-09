import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { useAppSelector } from '../../../app/hooks';
import { getRecordedHoursPatch } from '../../../app/slices/workHours';
import { store } from '../../../app/store';
import { getFormatedDate } from '../../../shared/helpers/transferHelper';

const militaryToStandardTime = (isoTime: string) => {
  const date = new Date(isoTime);
  if (isNaN(date.getTime())) return 'Invalid time'; // Manejo de error
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

  const [editing, setEditing] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string>('');
  const [checkOutTime, setCheckOutTime] = useState<string>('');

  //   console.log(dataWorkHours?.map((e) => e.userId.username));

  const hoursInit = dataWorkHours?.map((e) => e.startWork);
  console.log(hoursInit);

  const hoursEnd = dataWorkHours?.map((e) => e.endWork);
  console.log(hoursEnd);

  const formatDate = (date: Date) =>
    date
      .toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      .replace(/\//g, '-');

  const today = new Date();
  const returnStartDate = new Date(today);
  const returnEndDate = new Date(today);

  returnStartDate.setDate(returnStartDate.getDate() - 1);
  returnEndDate.setDate(returnEndDate.getDate() + 1);

  const dataSend = {
    startDate: formatDate(returnStartDate),
    endDate: formatDate(returnEndDate),
    sucursalId: user?.sucursalId?._id ?? '',
  };

  useEffect(() => {
    store.dispatch(getRecordedHoursPatch(dataSend)).unwrap();
  }, [user?.sucursalId?._id ?? '']);

  //   useEffect(() => {
  //     // Establecer valores iniciales de checkIn y checkOut con horsDayli, convertidos al formato estándar
  //     if (horsDayli.length > 0) {
  //       setCheckInTime(militaryToStandardTime(horsDayli[0].checkIn));
  //       setCheckOutTime(militaryToStandardTime(horsDayli[0].checkOut));
  //     }
  //   }, []);

  //   // Handler para guardar los cambios globalmente
  //   const handleSaveChanges = () => {
  //     // console.log('Saving changes for all employees');
  //     // Aquí puedes actualizar los registros de los empleados con los nuevos valores globales
  //     horsDayli.forEach((employee) => {
  //       const checkInMilitary = standardToMilitaryTime(checkInTime);
  //       const checkOutMilitary = standardToMilitaryTime(checkOutTime);
  //       employee.checkIn = checkInMilitary;
  //       employee.checkOut = checkOutMilitary;
  //     });
  //     // console.log(horsDayli);
  //     setEditing(false);
  //   };

  //   const dayeCheckIn = horsDayli.flatMap((e) => e.checkIn);
  //   const dayeCheckOut = horsDayli.flatMap((e) => e.checkOut);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <span className="text-3xl font-bold">Employee Attendance</span>

        <div className="flex items-center gap-2 justify-between">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Attendance Records
              </CardTitle>
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm">
                  <p className="font-medium">
                    {/* From: {startDate.toLocaleDateString()} */}
                  </p>
                  <p className="font-medium">
                    {/* To: {endDate.toLocaleDateString()} */}
                  </p>
                </div>
                <div className="flex items-center gap-2 uppercase">
                  {/* {dayeCheckIn.toLocaleString()} Am -{' '}
                  {dayeCheckOut.toLocaleString()} Pm */}
                </div>
              </div>
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
                  {dataWorkHours?.map((employee) => {
                    return (
                      <TableRow key={employee._id}>
                        <TableCell>{employee.userId.username}</TableCell>
                        <TableCell>{employee.userId.role}</TableCell>

                        <TableCell>
                          {getFormatedDate(new Date(employee.date))}{' '}
                        </TableCell>
                        <TableCell>
                          {militaryToStandardTime(employee.hourEntry)}
                        </TableCell>
                        <TableCell>
                          {militaryToStandardTime(employee?.hourExit ?? '')}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Edit Times Globally</h2>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <label htmlFor="checkInTime" className="font-medium">
                  Check-in Time
                </label>
                <Input
                  id="checkInTime"
                  type="time"
                  value={checkInTime || ''}
                  onChange={(e) => setCheckInTime(e.target.value)}
                  disabled={!editing}
                  className="ml-2"
                />
              </div>

              <div className="flex items-center">
                <label htmlFor="checkOutTime" className="font-medium">
                  Check-out Time
                </label>
                <Input
                  id="checkOutTime"
                  type="time"
                  value={checkOutTime || ''}
                  onChange={(e) => setCheckOutTime(e.target.value)}
                  disabled={!editing}
                  className="ml-2"
                />
              </div>
            </div>

            <div className="mt-4">
              <Switch checked={editing} onCheckedChange={setEditing} />
              <span className="ml-2 font-medium">Enable Global Editing</span>
            </div>

            {/* {editing && (
              <Button onClick={handleSaveChanges} className="mt-4">
                Save Changes
              </Button>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
