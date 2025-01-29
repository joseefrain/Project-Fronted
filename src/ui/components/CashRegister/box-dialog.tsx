import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast, Toaster } from 'sonner';
import { ICreataCashRegister } from '../../../app/slices/cashRegisterSlice';

interface BoxDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any, mode: 'create' | 'ABIERTA' | 'CERRADA') => void;
  box?: ICreataCashRegister | undefined;
  mode: 'create' | 'ABIERTA' | 'CERRADA';
  iduser: string;
}

export function BoxDialog({
  isOpen,
  onClose,
  onSave,
  box,
  mode,
  iduser,
}: BoxDialogProps) {
  const [formValues, setFormValues] = useState({
    montoInicial: '',
    montoFinal: '',
    consecutivo: '',
    usuarioId: iduser,
    usuarioArqueoId: '',
    closeWithoutCounting: false,
  });

  useEffect(() => {
    if (box) {
      setFormValues({
        montoInicial: box.montoInicial.toString(),
        consecutivo: box.consecutivo?.toString() || '',
        montoFinal: '',
        usuarioId: '',
        usuarioArqueoId: box.usuarioAperturaId,
        closeWithoutCounting: false,
      });
    } else {
      setFormValues({
        montoInicial: '',
        consecutivo: '',
        montoFinal: '',
        usuarioId: '',
        usuarioArqueoId: '',
        closeWithoutCounting: false,
      });
    }
  }, [box]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormValues((prev) => ({ ...prev, [id]: checked }));
    } else {
      setFormValues((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { montoInicial, montoFinal, closeWithoutCounting } = formValues;

    if (mode === 'create' && !montoInicial) {
      toast.error('Debe ingresar un monto inicial');
      return;
    }
    if (mode === 'ABIERTA' && !montoInicial) {
      toast.error('Debe ingresar todos los campos para abrir la caja');
      return;
    }
    if (mode === 'CERRADA' && (!montoFinal || !box?._id)) {
      toast.error('Debe ingresar todos los campos para cerrar la caja');
      return;
    }

    const data =
      mode === 'create'
        ? {
            montoInicial: Number(montoInicial),
            consecutivo: Number(formValues.consecutivo),
          }
        : mode === 'ABIERTA'
          ? {
              cajaId: box?._id,
              montoInicial: Number(montoInicial),
            }
          : {
              cajaId: box?._id,
              montoFinalDeclarado: montoFinal,
              usuarioArqueoId: box?.usuarioAperturaId,
              closeWithoutCounting: closeWithoutCounting,
            };

    onSave(data, mode);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] font-onest">
          <DialogHeader>
            <DialogTitle>
              {mode === 'create'
                ? 'Nueva Caja'
                : mode === 'ABIERTA'
                  ? 'Abrir Caja'
                  : 'Cerrar Caja'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {['create'].includes(mode) && (
              <InputField
                id="montoInicial"
                label="Monto Inicial"
                value={formValues.montoInicial}
                onChange={handleChange}
                placeholder="Ingrese el monto inicial"
                type="number"
              />
            )}
            {mode === 'ABIERTA' && (
              <InputField
                id="montoInicial"
                label="Monto Inicial"
                value={formValues.montoInicial}
                onChange={handleChange}
                placeholder="Ingrese el monto inicial"
                type="number"
              />
            )}
            {mode === 'CERRADA' && (
              <>
                <InputField
                  id="montoFinal"
                  label="Monto Final"
                  value={formValues.montoFinal}
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
              </>
            )}
            <div className="flex justify-end pt-4 space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {mode === 'create'
                  ? 'Crear Caja'
                  : mode === 'ABIERTA'
                    ? 'Abrir Caja'
                    : 'Cerrar Caja'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  );
}

function InputField({
  id,
  label,
  ...props
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
    </div>
  );
}

export interface ICloseCash {
  cajaId: string;
  montoFinalDeclarado: string;
  usuarioArqueoId: string;
  closeWithoutCounting: boolean;
}
