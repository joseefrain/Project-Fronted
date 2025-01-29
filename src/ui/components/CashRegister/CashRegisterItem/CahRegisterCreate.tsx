import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast, Toaster } from 'sonner';
import { ICreataCashRegister } from '@/app/slices/cashRegisterSlice';
import { useAppSelector } from '@/app/hooks';
import { InputField } from './Input';

export function CashRegisterCreate({
  box,
  isOpen,
  onClose,
  onSave,
}: {
  box?: ICreataCashRegister;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ICreataCashRegister) => void;
}) {
  const userId = useAppSelector((state) => state.auth.signIn.user)
    ?._id as string;

  const [formValues, setFormValues] = useState<ICreataCashRegister>({
    usuarioAperturaId: userId,
    montoInicial: box?.montoInicial || 0,
    consecutivo: box?.consecutivo,
    sucursalId: typeof box?.sucursalId === 'string' ? box?.sucursalId : '',
  });

  useEffect(() => {
    setFormValues({
      usuarioAperturaId: userId,
      montoInicial: box?.montoInicial || 0,
      consecutivo: box?.consecutivo,
      sucursalId: typeof box?.sucursalId === 'string' ? box?.sucursalId : '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const monto = Number(formValues.montoInicial);
    if (isNaN(monto) || monto <= 0) {
      toast.error('Debe ingresar un monto inicial válido');
      return;
    }

    onSave({ ...formValues, montoInicial: monto });
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crear Caja</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              id="montoInicial"
              label="Monto Inicial"
              value={formValues.montoInicial.toString()}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  montoInicial: parseFloat(e.target.value),
                })
              }
              placeholder="Ingrese el monto inicial"
              type="number"
            />
            <div className="flex justify-end pt-4 space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Crear Caja</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Toaster richColors position="bottom-right" />
    </>
  );
}
