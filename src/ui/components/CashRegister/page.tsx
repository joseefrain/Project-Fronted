import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { store } from '../../../app/store';
import {
  createBox,
  getboxesbyBranch,
  ICreataCashRegister,
} from '../../../app/slices/cashRegisterSlice';
import { useAppSelector } from '../../../app/hooks';
import { useRoleAccess } from '../../../shared/hooks/useRoleAccess';
import { PAGES_MODULES } from '../../../shared/helpers/roleHelper';
import { CashRegisterCard } from './CashRegisterItem/CashRegisterCard';
import { CashRegisterCreate } from './CashRegisterItem/CahRegisterCreate';
import { toast } from 'sonner';

export const CashRegister = () => {
  const access = useRoleAccess(PAGES_MODULES.CASHREGISTER);
  const branchesID = useAppSelector((state) => state.auth.signIn.user);
  const dataBoxes = useAppSelector((state) => state.boxes.BoxesData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBox, setEditingBox] = useState<ICreataCashRegister>();
  const [, setDialogMode] = useState(false);

  useEffect(() => {
    store
      .dispatch(getboxesbyBranch(branchesID?.sucursalId?._id as string))
      .unwrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateBox = async (data: ICreataCashRegister) => {
    try {
      await store
        .dispatch(
          createBox({
            ...data,
            sucursalId: branchesID?.sucursalId?._id as string,
            usuarioAperturaId: branchesID?._id as string,
          })
        )
        .unwrap();
      toast.success('Caja creada correctamente');
      setIsDialogOpen(false);
      setEditingBox(undefined);
    } catch (error: any) {
      toast.error('Error al crear la caja, intente nuevamente', error);
    }
  };

  return (
    <div className="container py-10 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-onest max-sm:text-[20px]">
          Administración de Cajas
        </h1>
        {access.create && (
          <Button
            onClick={() => {
              setIsDialogOpen(true);
              setEditingBox(undefined);
              setDialogMode(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2 max-sm:mr-0" />
            <p className="max-sm:hidden">Nueva Caja</p>
          </Button>
        )}
      </div>
      {(dataBoxes?.length === 0 || !dataBoxes) && (
        <div className="p-4 text-center">
          <h1 className="text-lg text-gray-400 dark:text-white font-onest">
            No hay cajas creadas en este sucursal.
          </h1>
        </div>
      )}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dataBoxes?.map((box) => (
          <CashRegisterCard key={box._id} cashRegister={box} access={access} />
        ))}
      </div>
      <CashRegisterCreate
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleCreateBox}
        box={editingBox}
      />
    </div>
  );
};
