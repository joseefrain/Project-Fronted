import { useEffect } from 'react';
import { store } from '@/app/store';
import { fetchBranches, setSelectedBranch } from '@/app/slices/branchSlice';
import { useAppSelector } from '@/app/hooks';
import { Branch } from '@/interfaces/branchInterfaces';
import { Card, CardFooter, CardHeader } from '../../../components/ui/card';
import './styles.scss';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
} from '../../../components/ui/drawer';
import {
  closeDrawer,
  openDrawerCashRegister,
  updateBranchUser,
  updateUserCashier,
} from '../../../app/slices/login';
import {
  getUserCashier,
  IGetUserCashier,
} from '../../../app/slices/cashRegisterSlice';

export const ModalBranchs = () => {
  const branches = useAppSelector((state) => state.branches.data);
  const ID = useAppSelector((state) => state.auth.signIn.user);
  const storedBranch = localStorage.getItem('selectedBranch');
  const selectedBranch = storedBranch ? JSON.parse(storedBranch) : null;

  useEffect(() => {
    store.dispatch(fetchBranches()).unwrap();
  }, []);

  const handleSelectBranch = async (branch: Branch) => {
    try {
      store.dispatch(setSelectedBranch(branch));
      localStorage.setItem('selectedBranch', JSON.stringify(branch));

      const userData = localStorage.getItem('user');
      if (!userData) {
        console.warn('No se encontró la clave "user" en localStorage');
        return;
      }

      store.dispatch(updateBranchUser(branch));

      const data: IGetUserCashier = {
        usuarioId: ID?._id ?? '',
        sucursalId: selectedBranch?._id ?? '',
      };

      const userCashier = await store.dispatch(getUserCashier(data)).unwrap();

      if (userCashier.data === null) {
        console.log(userCashier.data, 'userCashier');
        store.dispatch(openDrawerCashRegister());
      }

      const key = 'user';

      const storedData = localStorage.getItem(key);
      if (storedData) {
        try {
          let userData = JSON.parse(JSON.stringify(JSON.parse(storedData)));

          userData.cajaId = userCashier.data;
          userData.user.sucursalId = branch;

          store.dispatch(updateUserCashier(userData));
          localStorage.setItem(key, JSON.stringify(userData));

          console.log('Datos actualizados correctamente.');
        } catch (error) {
          console.error('Error al parsear JSON:', error);
        }
      }

      store.dispatch(closeDrawer());
    } catch (error) {
      console.error('Error al seleccionar sucursal:', error);
    }
  };

  return (
    <>
      <div className="container mx-auto ">
        <div>
          <div className="container-modalBranchs">
            {branches.map((branch) => (
              <Card
                onClick={() => {
                  handleSelectBranch(branch);
                }}
                key={branch._id}
                className="cursor-pointer"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 ">
                  <div className="flex items-center space-x-2 ">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                      {branch.nombre[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold">{branch.nombre}</h3>
                      <p className="text-sm text-muted-foreground">
                        {branch.ciudad}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardFooter className="flex flex-wrap justify-between gap-2"></CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export const BranchDrawer = () => {
  const isDrawerOpen = useAppSelector((state) => state.auth.isOpen);

  return (
    <Drawer open={isDrawerOpen} dismissible={false} disablePreventScroll>
      <DrawerContent className="  mb-[10rem] ">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>Seleciona una sucursal, para continuar</DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <ModalBranchs />
            </div>
            <div className="mt-3 h-[120px]"></div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
