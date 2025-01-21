import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ICajaBrach, openBoxes } from '@/app/slices/cashRegisterSlice';
import { useAppSelector } from '@/app/hooks';
import ActionCashier from './ActionCashier';
import { InputField } from './Input';
import { store } from '@/app/store';
import { updateUserCashier } from '@/app/slices/login';

interface CashRegisterOpenProps {
  box: ICajaBrach;
}

interface CashRegisterOpenState {
  montoInicial: string;
  usuarioAperturaId: string;
  cajaId: string;
}

export function CashRegisterOpen({ box }: CashRegisterOpenProps) {
  const userId = useAppSelector((state) => state.auth.signIn.user)
    ?._id as string;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => setIsModalOpen(false);

  const [formValues, setFormValues] = useState<CashRegisterOpenState>({
    montoInicial: '',
    usuarioAperturaId: userId,
    cajaId: box._id,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormValues((prev) => ({ ...prev, [id]: checked }));
    } else {
      setFormValues((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleOpenCashier = () => {
    const userData = localStorage.getItem('user');

    if (userData) {
      const parsedUserData = JSON.parse(userData);
      store
        .dispatch(
          openBoxes({
            cajaId: formValues.cajaId,
            usuarioAperturaId: formValues.usuarioAperturaId,
            montoInicial: parseFloat(formValues.montoInicial),
          })
        )
        .unwrap()
        .then((data) => {
          parsedUserData.cajaId = data;
          store.dispatch(updateUserCashier(data));
          localStorage.setItem('user', JSON.stringify(parsedUserData));
          closeModal();
          toast.success('Caja abierta correctamente');
        });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { montoInicial } = formValues;

    if (!montoInicial) {
      toast.error('Debe ingresar todos los campos para abrir la caja');
      return;
    }

    handleOpenCashier();
  };

  return (
    <>
      <ActionCashier
        isOpenBox={box.estado === 'ABIERTA'}
        openModal={openModal}
      />
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Abrir Caja</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              id="montoInicial"
              label="Monto Inicial"
              value={formValues.montoInicial}
              onChange={handleChange}
              placeholder="Ingrese el monto inicial"
              type="number"
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={closeModal}>
                Cancelar
              </Button>
              <Button type="submit">Confirmar Apertura</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* <Toaster /> */}
    </>
  );
}
