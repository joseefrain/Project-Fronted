import { useEffect } from 'react';
import { store } from '@/app/store';
import { fetchBranches, setSelectedBranch } from '@/app/slices/branchSlice';
import { useAppSelector } from '@/app/hooks';
import { Branch } from '@/interfaces/branchInterfaces';
import { Card, CardHeader } from '../../../components/ui/card';
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
import './styles.scss';

export const ModalBranchs = () => {
  const branches = useAppSelector((state) => state.branches.data);
  const ID = useAppSelector((state) => state.auth.signIn.user);
  const key = 'user';

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
        sucursalId: branch._id ?? '',
      };

      const userCashier = await store.dispatch(getUserCashier(data)).unwrap();

      if (userCashier === null) {
        store.dispatch(openDrawerCashRegister());
      }

      const storedData = localStorage.getItem(key);
      if (storedData) {
        try {
          let userData = JSON.parse(JSON.stringify(JSON.parse(storedData)));

          userData.cajaId = userCashier;
          userData.user.sucursalId = branch;

          store.dispatch(updateUserCashier(userData));
          localStorage.setItem(key, JSON.stringify(userData));
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
    <div className="container-cardBranchs">
      {branches.map((branch) => (
        <Card
          key={branch._id}
          onClick={() => handleSelectBranch(branch)}
          className="cursor-pointer w-[15rem] h-[8rem] rounded-lg border-2"
        >
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center min-w-8 w-8 h-8 rounded-full bg-primary text-primary-foreground">
                {branch.nombre[0]}
              </div>
              <div>
                <h3 className="font-semibold">{branch.nombre}</h3>
                <p className="text-sm text-muted-foreground">{branch.ciudad}</p>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export const BranchDrawer = () => {
  const isDrawerOpen = useAppSelector((state) => state.auth.isOpen);

  return (
    <Drawer open={isDrawerOpen} dismissible={false} disablePreventScroll>
      <DrawerContent className="drawer-content">
        <div className="container-DrawerContent">
          <DrawerHeader>Selecciona una sucursal para continuar</DrawerHeader>
          <div className="flex items-center justify-center">
            <ModalBranchs />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
