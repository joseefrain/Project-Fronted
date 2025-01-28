import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BoxDialog } from './box-dialog';
import { store } from '../../../app/store';
import {
  closeBoxes,
  createBox,
  getBoxById,
  getboxesbyBranch,
  ICreataCashRegister,
  openBoxes,
} from '../../../app/slices/cashRegisterSlice';
import { useAppSelector } from '../../../app/hooks';
import { useRoleAccess } from '../../../shared/hooks/useRoleAccess';
import { PAGES_MODULES } from '../../../shared/helpers/roleHelper';
import { removeFromLocalStorage } from '../../../app/slices/login';
import { CashRegisterCard } from './CashRegisterItem/CashRegisterCard';

export const CashRegister = () => {
  const access = useRoleAccess(PAGES_MODULES.CASHREGISTER);
  const branchesID = useAppSelector((state) => state.auth.signIn.user);
  const dataBoxes = useAppSelector((state) => state.boxes.BoxesData);

  const idbox = localStorage.getItem('opened_box_id');
  const selectBranch = localStorage.getItem('selectedBranch');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBox, setEditingBox] = useState<ICreataCashRegister>();
  const [dialogMode, setDialogMode] = useState<
    'create' | 'ABIERTA' | 'CERRADA'
  >('create');

  const resetLocalStorage = () => {
    removeFromLocalStorage('boxState');
  };

  useEffect(() => {
    if (selectBranch) {
      removeFromLocalStorage('boxState');
    }
  }, [selectBranch]);

  useEffect(() => {
    store
      .dispatch(getboxesbyBranch(branchesID?.sucursalId?._id as string))
      .unwrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (idbox) {
      store.dispatch(getBoxById(idbox as string));
    }
  }, [idbox]);

  const handleSaveBox = (data: any, mode: 'create' | 'ABIERTA' | 'CERRADA') => {
    if (mode === 'create') {
      store
        .dispatch(
          createBox({
            ...data,
            sucursalId: branchesID?.sucursalId?._id as string,
            usuarioAperturaId: branchesID?._id as string,
          })
        )
        .unwrap();
    } else if (mode === 'ABIERTA') {
      store
        .dispatch(
          openBoxes({
            cajaId: data.cajaId,
            usuarioAperturaId: branchesID?._id as string,
            montoInicial: data.montoInicial,
          })
        )
        .unwrap();
    } else if (mode === 'CERRADA') {
      store
        .dispatch(
          closeBoxes({
            cajaId: data.cajaId,
            usuarioArqueoId: data.usuarioArqueoId,
            montoFinalDeclarado: data.montoFinalDeclarado,
            closeWithoutCounting: data.closeWithoutCounting,
          })
        )
        .unwrap()

        .then(() => {
          resetLocalStorage();
          setIsDialogOpen(false);
        });
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
              setEditingBox(null!);
              setDialogMode('create');
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

      <BoxDialog
        iduser={branchesID?._id as string}
        key={editingBox?._id}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingBox(null!);
        }}
        onSave={handleSaveBox}
        box={editingBox}
        mode={dialogMode}
      />
    </div>
  );
};
