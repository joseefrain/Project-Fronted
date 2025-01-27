import { useAppSelector } from '@/app/hooks';
import { logout, openDrawer } from '@/app/slices/login';
import { store } from '@/app/store';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DoorClosed, Store, User } from 'lucide-react';
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

export const ProfileUser = () => {
  const caja = store.getState().boxes.BoxesData;
  const user = useAppSelector((state) => state.auth.signIn.user);
  const userFilteredData = caja
    ?.filter(
      (c: ICajaBrach) =>
        typeof c.usuarioAperturaId !== 'string' &&
        c.usuarioAperturaId?._id === user?._id
    )
    .map((c: ICajaBrach) => ({
      consecutivo: c.consecutivo,
      estado: c.estado,
    }));

  const [, setEditingSucursal] = useState(false);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      store.dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Error trying to logout: ', error);
    }
  };

  const openDialog = (isEdit: boolean) => {
    setEditingSucursal(isEdit);
    store.dispatch(openDrawer());
  };

  const selectedBranchFromLocalStorage = getSelectedBranchFromLocalStorage();
  const branches = useAppSelector((state) => state.branches.data);
  const [selectedBranch, setSelectedBranch] = useState<{
    nombre: string;
    _id: string;
  } | null>(null);

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

  const id = user?.sucursalId?._id;
  useEffect(() => {
    if (id) {
      store.dispatch(getboxesbyBranch(id as string));
    }
  }, [id]);

  return (
    <>
      <div>
        <div className="flex flex-col items-start justify-center ">
          <h1 className="m-auto text-xl font-bold font-onest uppercase">
            {user?.username}
          </h1>
          <p className="text-sm text-muted-foreground font-onest w-full justify-center ">
            <span className="font-semibold text-[14px] font-onest text-black dark:text-white">
              {user?.role}-
            </span>
            {selectedBranch ? selectedBranch.nombre : user?.sucursalId?.nombre}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 p-2">
        <div className="container-header__profile__SC">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className=" flex flex-wrap items-center gap-2 sm:flex-nowrap"
          >
            {userFilteredData?.map(
              (
                caja: { consecutivo: number; estado: string },
                index: number
              ) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="group relative rounded bg-background/50 px-3 py-2 shadow-sm transition-shadow h-[38px] max-sm:h-[34px] hover:shadow-md border dark:border-gray-700"
                >
                  <div className="flex items-center gap-3 max-sm:w-[4.5rem] w-full">
                    <motion.div
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      className="relative"
                    >
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                      <div className="absolute inset-0 animate-ping rounded-full bg-green-500/40" />
                    </motion.div>
                    <div className="flex gap-3 items-center">
                      <span className="font-semibold text-[14px] font-onest dark:text-white">
                        caja #{caja.consecutivo}
                      </span>
                      <span className="font-semibold text-green-500 text-[14px] font-onest max-sm:hidden">
                        {caja.estado}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            )}
          </motion.div>

          {user?.role === ROLE.ROOT && (
            <Button
              onClick={() => openDialog(false)}
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
              <PopoverContent className="w-22">
                <Button
                  onClick={handleLogout}
                  variant="secondary"
                  className="font-onest"
                >
                  <DoorClosed className="w-4 h-4" />
                  Salir
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </>
  );
};
