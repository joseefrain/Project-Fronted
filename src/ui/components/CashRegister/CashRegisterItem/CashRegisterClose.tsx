import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { closeBoxes, ICajaBrach } from '@/app/slices/cashRegisterSlice';
import { useAppSelector } from '@/app/hooks';
import ActionCashier from './ActionCashier';
import { InputField } from './Input';
import { store } from '@/app/store';
import { Label } from '@/components/ui/label';
import { updateUserCashier } from '@/app/slices/login';

interface CashRegisterOpenProps {
  box: ICajaBrach;
}

interface CashRegisterOpenState {
  montoFinalDeclarado: string;
  usuarioArqueoId: string;
  cajaId: string;
  closeWithoutCounting: boolean;
}

export function CashRegisterClose({ box }: CashRegisterOpenProps) {
  const userId = useAppSelector((state) => state.auth.signIn.user)
    ?._id as string;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => setIsModalOpen(false);

  const [formValues, setFormValues] = useState<CashRegisterOpenState>({
    closeWithoutCounting: false,
    usuarioArqueoId: userId,
    cajaId: box._id,
    montoFinalDeclarado: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormValues((prev) => ({ ...prev, [id]: checked }));
    } else {
      setFormValues((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleCloseCashier = () => {
    const userData = localStorage.getItem('user');

    if (userData) {
      const parsedUserData = JSON.parse(userData);
      store
        .dispatch(
          closeBoxes({
            cajaId: formValues.cajaId,
            montoFinalDeclarado: formValues.montoFinalDeclarado,
            usuarioArqueoId: formValues.usuarioArqueoId,
            closeWithoutCounting: formValues.closeWithoutCounting,
          })
        )
        .unwrap()
        .then(() => {
          parsedUserData.cajaId = null;
          localStorage.setItem('user', JSON.stringify(parsedUserData));
          store.dispatch(updateUserCashier(null));
          closeModal();
          toast.success('Caja cerrada correctamente');
        });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { montoFinalDeclarado } = formValues;

    if (!montoFinalDeclarado) {
      toast.error('Debe ingresar todos los campos para cerrar la caja');
      return;
    }

    handleCloseCashier();
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
            <DialogTitle>Confirmar Cierre de Caja</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                  id="montoFinalDeclarado"
                  label="Monto Final"
                  value={formValues.montoFinalDeclarado}
                  onChange={handleChange}
                  placeholder="Ingrese el monto final"
                  type="number"
                />
                <div className="space-y-2">
                  <Label htmlFor="closeWithoutCounting">
                    Cerrar sin Arqueo
                  </Label>
                  <input
                    type="checkbox"
                    id="closeWithoutCounting"
                    checked={formValues.closeWithoutCounting}
                    onChange={handleChange}
                  />
                </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={closeModal}>
                Cancelar
              </Button>
              <Button type="submit">Cerrar Caja</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
