import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExternalLink } from 'lucide-react';
import { store } from '../../../app/store';
import { useAppSelector } from '../../../app/hooks';
import {
  getboxesbyBranch,
  getUserCashier,
  ICajaBrach,
  IOpenCash,
  openBoxes,
} from '../../../app/slices/cashRegisterSlice';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
} from '../../../components/ui/drawer';
import {
  closeDrawerCashRegister,
  updateUserCashier,
} from '../../../app/slices/login';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const CardCash = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.signIn.user);
  const caja = store.getState().boxes.BoxesData;
  const id = user?.sucursalId?._id;

  const [, setIsLoading] = useState(true);
  const [formValues, setFormValues] = useState<IOpenCash>({
    montoInicial: 0,
    usuarioAperturaId: user?._id as string,
    cajaId: '',
  });

  const IDtest = store.getState().auth.signIn.cajaId as ICajaBrach;
  const isUserAuthorized = IDtest?.usuarioAperturaId === user?._id;

  useEffect(() => {
    if (id) {
      store
        .dispatch(getboxesbyBranch(id))
        .unwrap()
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  useEffect(() => {
    const fetchUserCashier = async () => {
      await store
        .dispatch(
          getUserCashier({
            usuarioId: user?._id ?? '',
            sucursalId: user?.sucursalId?._id ?? '',
          })
        )
        .unwrap();
    };
    fetchUserCashier();
  }, [caja, isUserAuthorized]);

  useEffect(() => {
    const timeoutId = setTimeout(
      () => {
        if (!caja?.length) {
          store.dispatch(closeDrawerCashRegister());
          navigate('/cashRegister');
        } else if (isUserAuthorized) {
          store.dispatch(closeDrawerCashRegister());
        }
      },
      caja?.length ? 10 : 1000
    );

    return () => clearTimeout(timeoutId);
  }, [caja, isUserAuthorized]);

  const openModal = (cajaId: string) =>
    setFormValues((prev) => ({ ...prev, cajaId }));
  const closeModal = () => setFormValues((prev) => ({ ...prev, cajaId: '' }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [id]: id === 'montoInicial' ? Number(value) || 0 : value,
    }));
  };

  const handleOpenCaja = () => {
    const userData = localStorage.getItem('user');
    if (!userData) return;

    const parsedUserData = JSON.parse(userData);
    store
      .dispatch(openBoxes(formValues))
      .unwrap()
      .then((data) => {
        parsedUserData.cajaId = data;
        store.dispatch(updateUserCashier(data));
        localStorage.setItem('user', JSON.stringify(parsedUserData));
        closeModal();
        store.dispatch(closeDrawerCashRegister());
        toast.success('Caja abierta correctamente');
      });
  };

  const getStatusClass = (estado: string) =>
    estado === 'ABIERTA' ? 'text-green-600' : 'text-red-600';

  return (
    <div className="p-6 space-y-6">
      {!caja?.length && (
        <div className="p-4 text-center">
          <h1 className="text-lg text-gray-400 dark:text-white font-onest">
            No hay cajas creadas en esta sucursal.
          </h1>
        </div>
      )}

      <div className="flex gap-5 justify-center">
        {caja?.map(({ _id, estado, consecutivo }) => (
          <div
            key={_id}
            className="p-4 rounded-lg shadow-md border bg-white w-64 space-y-4 transition hover:shadow-lg dark:bg-gray-800"
          >
            <h3
              className={`font-semibold font-onest dark:text-white ${getStatusClass(estado)}`}
            >
              Usuario desconocido
            </h3>
            <p className={`text-sm ${getStatusClass(estado)}`}>{estado}</p>
            <div className="flex justify-between items-center w-full">
              <span
                className={`py-1 rounded-full text-sm font-medium ${getStatusClass(estado)}`}
              >
                Caja #{consecutivo}
              </span>
              {estado === 'CERRADA' && (
                <DialogTrigger asChild>
                  <button onClick={() => openModal(_id)}>
                    <ExternalLink className="w-5 h-5 text-blue-600 dark:text-white" />
                  </button>
                </DialogTrigger>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Global */}
      <Dialog open={!!formValues.cajaId} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Abrir Caja</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Monto Inicial
            </label>
            <Input
              type="number"
              id="montoInicial"
              value={formValues.montoInicial}
              onChange={handleChange}
              className="p-2 border rounded w-full"
              placeholder="Ingrese el monto inicial"
            />
            <Button
              onClick={handleOpenCaja}
              className="w-full bg-green-600 text-white"
            >
              Confirmar Apertura
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const CashDrawer = () => {
  const isDrawerOpen = useAppSelector((state) => state.auth.isOpenCashRegister);
  const navigate = useNavigate();

  const handleGoToCashRegister = () => {
    navigate('/cashRegister');
    store.dispatch(closeDrawerCashRegister());
  };

  return (
    <Drawer open={isDrawerOpen} dismissible={false} disablePreventScroll>
      <DrawerContent className="  mb-[10rem] ">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            Seleccione una Caja, para poder continuar.
            <Button
              onClick={handleGoToCashRegister}
              className="uppercase font-semibold text-sm text-white bg-green-600 hover:bg-green-700 rounded-md"
            >
              Ir a cajas
            </Button>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <CardCash />
            </div>
            <div className="mt-3 h-[120px]"></div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
