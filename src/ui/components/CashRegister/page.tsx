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
import { removeFromLocalStorage } from '../../../app/slices/login';

export const CashRegister = () => {
  const branchesID = useAppSelector((state) => state.auth.signIn.user);
  const dataBoxes = useAppSelector((state) => state.boxes.BoxesData);
  const statusCashRegister = useAppSelector((state) =>
    state.boxes.BoxesData?.flatMap((box) => ({
      id: box._id,
      estado: box.estado,
    }))
  );
  const idbox = localStorage.getItem('opened_box_id');
  const selectBranch = localStorage.getItem('selectedBranch');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBox, setEditingBox] = useState<ICreataCashRegister>();
  const [dialogMode, setDialogMode] = useState<
    'create' | 'ABIERTA' | 'CERRADA'
  >('create');

  const saveBoxStateToLocalStorage = (
    boxes: { id: string; estado: string }[]
  ) => {
    const currentBoxes = JSON.parse(localStorage.getItem('boxState') || '[]');
    const updatedBoxes = boxes.reduce(
      (acc: any[], updatedBox) => {
        const index = acc.findIndex((box) => box.id === updatedBox.id);
        if (index !== -1) {
          acc[index] = updatedBox;
        } else {
          acc.push(updatedBox);
        }
        return acc;
      },
      [...currentBoxes]
    );
    localStorage.setItem('boxState', JSON.stringify(updatedBoxes));
  };

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
      .unwrap()
      .then(() => {
        if (statusCashRegister) {
          saveBoxStateToLocalStorage(statusCashRegister);
        }
      });
  }, []);

  useEffect(() => {
    if (dataBoxes) {
      const processedStates = dataBoxes.map((box) => ({
        id: box._id,
        estado: box.estado,
      }));
      saveBoxStateToLocalStorage(processedStates);
    }
  }, [dataBoxes]);

  useEffect(() => {
    if (statusCashRegister) {
      saveBoxStateToLocalStorage(statusCashRegister);
    }
  }, [statusCashRegister]);

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
          saveBoxStateToLocalStorage([
            { id: createdBox._id, estado: 'ABIERTA' },
          ]);
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
          saveBoxStateToLocalStorage([{ id: data.cajaId, estado: 'ABIERTA' }]);
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
          saveBoxStateToLocalStorage([{ id: data.cajaId, estado: 'CERRADA' }]);
          resetLocalStorage();
          setIsDialogOpen(false);
        });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Administración de Cajas</h1>
        <Button
          onClick={() => {
            setIsDialogOpen(true);
            setEditingBox(null!);
            setDialogMode('create');
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Nueva Caja
        </Button>
      </div>
      {(dataBoxes?.length === 0 || !dataBoxes) && (
        <div className="p-4 text-center">
          <h1 className="text-white">
            Debe de crear una caja en esta sucursal o seleccione una sucursal
            antes.
          </h1>
        </div>
      )}

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
