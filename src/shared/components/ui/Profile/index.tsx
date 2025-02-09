import { useAppSelector } from '@/app/hooks';
import { logout, openDrawer } from '@/app/slices/login';
import { store } from '@/app/store';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, DoorClosed, Store, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBranches } from '../../../../app/slices/branchSlice';
import { BranchDrawer } from '../../../../ui/components/ModalBranchs';
import {
  findBranchById,
  getSelectedBranchFromLocalStorage,
} from '../../../helpers/branchHelpers';
import { ModeToggle } from '../../../toggle.tsx';
import { ROLE } from '../../../../interfaces/roleInterfaces.ts';
import './styles.scss';
import {
  getboxesbyBranch,
  ICajaBrach,
} from '../../../../app/slices/cashRegisterSlice.ts';
import { motion } from 'framer-motion';
import './styles.scss';
import { CashDrawer } from '../../../../ui/components/ModalCashRegister/index.tsx';
import { formatNumber } from '../../../helpers/Branchs.tsx';
import {
  createRecordedHoursPatch,
  exitRecordedHourPatch,
  getRecordedHoursPatch,
} from '../../../../app/slices/workHours.ts';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '../../../../components/ui/dialog.tsx';

export const ProfileUser = () => {
  const selectedBranchFromLocalStorage = getSelectedBranchFromLocalStorage();
  const branches = useAppSelector((state) => state.branches.data);
  const [selectedBranch, setSelectedBranch] = useState<{
    nombre: string;
    _id: string;
  } | null>(null);
  const caja = useAppSelector((state) => state.boxes.BoxesData);
  const user = useAppSelector((state) => state.auth.signIn.user);
  const id = user?.sucursalId?._id;
  const [, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      store
        .dispatch(getboxesbyBranch(id))
        .unwrap()
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));
    }
  }, [id]);

  const userFilteredData = caja
    ?.filter((c: ICajaBrach) => {
      const usuarioId =
        typeof c.usuarioAperturaId === 'string'
          ? c.usuarioAperturaId
          : c.usuarioAperturaId?._id;

      return usuarioId === user?._id && c.estado?.toUpperCase() === 'ABIERTA';
    })
    .map((c: ICajaBrach) => ({
      montoEsperado: c.montoEsperado,
      consecutivo: c.consecutivo,
      estado: c.estado,
    }));

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      store.dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Error trying to logout: ', error);
    }
  };

  const goToCashiers = () => {
    navigate('/cashRegister');
  };

  const openDialog = () => {
    store.dispatch(openDrawer());
  };

  useEffect(() => {
    const branch = findBranchById(branches, selectedBranchFromLocalStorage);
    if (branch) {
      setSelectedBranch({ nombre: branch.nombre, _id: branch._id ?? '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branches]);

  useEffect(() => {
    store.dispatch(fetchBranches()).unwrap();
  }, []);

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
  const dataWorkHours = useAppSelector(
    (state) => state.workHours.recordedHours
  );
  const hoursInit = dataWorkHours?.map((e) => e.startWork.split('T')[0]);
  //   console.log(hoursInit);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isExitRegister, setIsExitRegister] = useState(false);
  const [hoursLocal] = useState(new Date());
  const [, setIsOpenDialog] = useState(false);

  const [error, setError] = useState(null); // Estado para manejar errores

  // Manejo para confirmar la entrada
  const handleConfirmRegister = async () => {
    try {
      await store.dispatch(
        createRecordedHoursPatch({
          userId: user?._id ?? '',
          date: hoursLocal,
          hourEntry: hoursLocal,
        })
      );
      setIsRegistered(true); // Solo cambia el estado si la petición fue exitosa
      setError(null); // Limpiar cualquier error previo
      setIsOpenDialog(false); // Cierra el modal después de confirmar
    } catch (error) {
      console.error('Error trying to register hour: ', error);
      setError(null); // Reset error state to null
      setIsOpenDialog(false); // Close modal if desired
    }
  };

  // Manejo para confirmar la salida
  const handleExitRegister = async () => {
    try {
      await store.dispatch(exitRecordedHourPatch(user?._id ?? ''));
      setIsExitRegister(true); // Solo cambia el estado si la petición fue exitosa
      setError(null); // Limpiar cualquier error previo
      setIsOpenDialog(false); // Cierra el modal después de confirmar
    } catch (error) {
      console.error('Error trying to exit register hour: ', error);
      setError(null);
      setIsOpenDialog(false); // Puedes cerrar el modal también si lo deseas
    }
  };

  return (
    <>
      <div>
        <CashDrawer />
        <div className="flex flex-col items-start justify-center ">
          <h1 className="m-auto text-xl font-bold uppercase font-onest">
            {user?.username}
          </h1>
          <p className="justify-center w-full text-sm whitespace-pre text-muted-foreground font-onest">
            <span className="font-semibold text-[14px] font-onest text-black dark:text-white">
              {user?.role}-
            </span>
            {selectedBranch ? selectedBranch.nombre : user?.sucursalId?.nombre}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 p-2">
        <div className="container-header_profile_SC">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-wrap items-center gap-2 sm:flex-nowrap"
          >
            {userFilteredData && userFilteredData.length > 0 ? (
              userFilteredData?.map(
                (
                  caja: {
                    consecutivo: number;
                    estado: string;
                    montoEsperado: { $numberDecimal: number };
                  },
                  index: number
                ) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="group relative rounded bg-background/50 px-3 py-2 shadow-sm transition-shadow h-[38px] max-sm:h-[34px] hover:shadow-md border dark:border-gray-700 hover:cursor-pointer"
                    onClick={goToCashiers}
                  >
                    <div className="flex items-center gap-3 max-sm:min-w-[4.5rem] w-full">
                      <motion.div
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        className="relative"
                      >
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                        <div className="absolute inset-0 rounded-full animate-ping bg-green-500/40" />
                      </motion.div>
                      <div className="flex items-center gap-3 uppercase whitespace-pre font-onest">
                        <span className="font-semibold text-[14px] font-onest dark:text-white">
                          caja #{caja.consecutivo}
                        </span>
                        <span className="font-semibold text-green-500 text-[14px] font-onest max-sm:hidden">
                          C$ {formatNumber(caja.montoEsperado.$numberDecimal)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
              )
            ) : (
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="group relative rounded bg-background/50 px-3 py-2 shadow-sm transition-shadow h-[38px] max-sm:h-max hover:shadow-md border dark:border-gray-700 border-red-300 hover:cursor-pointer min-w-[115px]"
                onClick={goToCashiers}
              >
                <div className="flex items-center w-full gap-3 max-sm:min-w-min">
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="relative"
                  >
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    <div className="absolute inset-0 rounded-full animate-ping bg-green-500/40" />
                  </motion.div>
                  <div className="flex items-center gap-3 uppercase font-onest">
                    <span className="hidden md:flex font-semibold text-[14px] font-onest text-red-500 dark:text-white">
                      No hay caja abierta
                    </span>
                    <span className="flex md:hidden font-semibold text-[14px] font-onest text-red-500 dark:text-white">
                      Sin caja
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {user?.role === ROLE.ROOT && (
            <Button
              onClick={() => openDialog()}
              className="w-full h-full sm:w-auto font-onest dark:bg-[#09090b] dark:text-white dark:border-gray-700"
            >
              <Store className="w-4 h-4 mr-0 sm:mr-2 " />
              <span className="hidden sm:block">Sucursal</span>
            </Button>
          )}
          <BranchDrawer />
        </div>

        <div className="flex items-center justify-center gap-3 p-2">
          <div className="container-profile__actions">
            <ModeToggle />
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex items-center justify-center w-10 h-10 text-white bg-black rounded-full cursor-pointer">
                  <span className="text-lg font-semibold text-white font-onest">
                    {user?.username ? (
                      user.username
                        .split(' ')
                        .slice(0, 2)
                        .map((word) => word.charAt(0).toUpperCase())
                        .join('')
                    ) : (
                      <User />
                    )}
                  </span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-22 flex flex-col items-center justify-center gap-3">
                <Button
                  onClick={handleLogout}
                  variant="secondary"
                  className="font-onest"
                >
                  <DoorClosed className="w-4 h-4" />
                  Salir
                </Button>

                {/* Botón para Marcar entrada o salida */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      className={`font-onest border-2 ${isRegistered ? 'border-green-500' : isExitRegister ? 'border-red-500' : 'border-gray-500'}`}
                      onClick={() => setIsOpenDialog(true)} // Solo abre el modal, no ejecuta la acción
                    >
                      <Check className="w-4 h-4" />
                      {isRegistered ? 'Marcar salida' : 'Marcar entrada'}
                    </Button>
                  </DialogTrigger>

                  {/* Dialogo de confirmación */}
                  <DialogContent>
                    <DialogHeader>
                      <h2 className="text-lg font-semibold">
                        {isRegistered
                          ? 'Confirmar salida'
                          : 'Confirmar entrada'}
                      </h2>
                    </DialogHeader>
                    <p className="mb-4">
                      Hora actual: {hoursLocal.toLocaleTimeString()}
                    </p>

                    {/* Mostrar el mensaje de error, si hay */}
                    {error && <p className="text-red-500">{error}</p>}

                    <DialogFooter>
                      <Button
                        onClick={
                          isRegistered
                            ? handleExitRegister
                            : handleConfirmRegister
                        } // Solo realiza la acción cuando se confirma
                        disabled={isRegistered && isExitRegister}
                      >
                        {isRegistered
                          ? 'Confirmar salida'
                          : 'Confirmar entrada'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsRegistered(false);
                          setIsExitRegister(false);
                          setIsOpenDialog(false); // Cierra el modal
                        }}
                      >
                        Cancelar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </>
  );
};
