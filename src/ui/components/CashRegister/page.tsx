import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BoxDialog } from './box-dialog';
import { BoxCard } from './box-card';
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

export const CashRegister = () => {
  const access = useRoleAccess(PAGES_MODULES.CASHREGISTER);
  const branchesID = useAppSelector((state) => state.auth.signIn.user);
  const dataBoxes = useAppSelector((state) => state.boxes.BoxesData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBox, setEditingBox] = useState<ICreataCashRegister>();
  const [dialogMode, setDialogMode] = useState<
    'create' | 'ABIERTA' | 'CERRADA'
  >('create');

  const saveBoxState = (state: string, boxId: string) => {
    const boxStateKey = `box_${boxId}_state`;
    localStorage.setItem(boxStateKey, state);
  };

  const resetLocalStorage = () => {
    localStorage.removeItem('opened_box_id');
  };

  const setOpenedBoxId = (boxId: string | null) => {
    if (boxId) {
      localStorage.setItem('opened_box_id', boxId);
    } else {
      localStorage.removeItem('opened_box_id');
    }
  };

  useEffect(() => {
    store
      .dispatch(getboxesbyBranch(branchesID?.sucursalId?._id as string))
      .unwrap();
  }, []);

  const idbox = localStorage.getItem('opened_box_id');
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
        .unwrap()
        .then((createdBox) => {
          saveBoxState('ABIERTA', createdBox._id);
          setOpenedBoxId(createdBox._id);
          setIsDialogOpen(false);
        });
    } else if (mode === 'ABIERTA') {
      store
        .dispatch(
          openBoxes({
            cajaId: data.cajaId,
            usuarioAperturaId: branchesID?._id as string,
            montoInicial: data.montoInicial,
          })
        )
        .unwrap()
        .then(() => {
          saveBoxState('ABIERTA', data.cajaId);
          setOpenedBoxId(data.cajaId);
          setIsDialogOpen(false);
        });
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
          saveBoxState('CERRADA', data.cajaId);
          resetLocalStorage();
          setIsDialogOpen(false);
        });
    }
  };

  return (
    <div className="container py-10 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Administración de Cajas</h1>
        {access.create && (
          <Button
            onClick={() => {
              setIsDialogOpen(true);
              setEditingBox(null!);
              setDialogMode('create');
            }}
          >
            <Plus className="w-4 h-4 mr-2" /> Nueva Caja
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dataBoxes?.map((box) => (
          <BoxCard
            key={box._id}
            box={box}
            onOpen={() => {
              setIsDialogOpen(true);
              setEditingBox(box as unknown as ICreataCashRegister);
              setDialogMode('ABIERTA');
            }}
            onClose={() => {
              setIsDialogOpen(true);
              setEditingBox(box as unknown as ICreataCashRegister);
              setDialogMode('CERRADA');
            }}
            access={access}
          />
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
