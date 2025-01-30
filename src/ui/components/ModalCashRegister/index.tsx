import { useState, useEffect } from 'react';

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
  ICajaBrach,
  IOpenCash,
  openBoxes,
} from '../../../app/slices/cashRegisterSlice';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
} from '../../../components/ui/drawer';
// import React from 'react';
import {
  closeDrawerCashRegister,
  updateUserCashier,
} from '../../../app/slices/login';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
// import React from 'react';

export const CardCash = () => {
  const caja = store.getState().boxes.BoxesData;
  const user = useAppSelector((state) => state.auth.signIn.user);
  const id = user?.sucursalId?._id;
  const [, setIsLoading] = useState(true);
  const ID = useAppSelector((state) => state.auth.signIn.user);
  const IDtest = store.getState().auth.signIn.cajaId as ICajaBrach;
  const userFilteredData = IDtest?.usuarioAperturaId === ID?._id;
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState<IOpenCash>({
    montoInicial: 0,
    usuarioAperturaId: user?._id as string,
    cajaId: '',
  });

  useEffect(() => {
    if (id) {
      store
        .dispatch(getboxesbyBranch(id))
        .unwrap()
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));
    }
  }, [id]);

  const openModal = (id: string) => {
    setFormValues((prev) => ({ ...prev, cajaId: id }));
  };

  const closeModal = () => {
    setFormValues((prev) => ({ ...prev, cajaId: '' }));
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [id]: id === 'montoInicial' ? Number(value) || 0 : value,
    }));
  };

  useEffect(() => {
    // eslint-disable-next-line no-undef
    let timeoutId: NodeJS.Timeout;

    if (!caja || caja.length === 0) {
      timeoutId = setTimeout(() => {
        store.dispatch(closeDrawerCashRegister());
        navigate('/cashRegister');
      }, 1000);
    } else if (userFilteredData) {
      timeoutId = setTimeout(() => {
        store.dispatch(closeDrawerCashRegister());
      }, 10);
    }

    return () => clearTimeout(timeoutId);
  }, [caja, userFilteredData]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Cajas Abiertas</h2>
      {(!caja || caja.length === 0) && (
        <div className="p-4 text-center">
          <h1 className="text-lg text-gray-400 dark:text-white font-onest">
            No hay cajas creadas en este sucursal.
          </h1>
        </div>
      )}

      <div className="flex gap-5 justify-center">
        {caja?.map((caja) => (
          <div
            key={caja._id}
            className="p-4 rounded-lg shadow-md border bg-white w-64 space-y-4 transition hover:shadow-lg dark:bg-gray-800"
          >
            <div className="flex justify-between items-center">
              <h3
                className={`font-semibold font-onest dark:text-white ${
                  caja.estado === 'ABIERTA' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {caja.estado === 'ABIERTA'
                  ? 'Usuario desconocido'
                  : 'Usuario desconocido'}
              </h3>
            </div>
            <p
              className={`text-sm ${
                caja.estado === 'ABIERTA' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {caja.estado}
            </p>
            <div className="flex justify-between items-center w-full">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  caja.estado === 'ABIERTA'
                    ? 'bg-green-200 text-green-600'
                    : 'bg-red-200 text-red-600'
                }`}
              >
                Caja #{caja.consecutivo}
              </span>
              <DialogTrigger asChild>
                <button onClick={() => openModal(caja._id)}>
                  <ExternalLink className="w-5 h-5 text-blue-600 dark:text-white" />
                </button>
              </DialogTrigger>
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

  return (
    <Drawer open={isDrawerOpen} dismissible={false} disablePreventScroll>
      <DrawerContent className="  mb-[10rem] ">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            Seleccione una Caja, para poder continuar.
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
