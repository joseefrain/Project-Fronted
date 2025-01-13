'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BoxDialog } from './box-dialog';
import { BoxCard } from './box-card';
import { store } from '../../../app/store';
import {
  closeBoxes,
  createBox,
  getboxesbyBranch,
  ICreataCashRegister,
  openBoxes,
} from '../../../app/slices/cashRegisterSlice';
import { useAppSelector } from '../../../app/hooks';

export const CashRegister = () => {
  const branchesID = useAppSelector((state) => state.auth.signIn.user);
  const dataBoxes = useAppSelector((state) => state.boxes.BoxesData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBox, setEditingBox] = useState<ICreataCashRegister>();
  const [dialogMode, setDialogMode] = useState<
    'create' | 'ABIERTA' | 'CERRADA'
  >('create');

  useEffect(() => {
    store
      .dispatch(getboxesbyBranch(branchesID?.sucursalId?._id as string))
      .unwrap();
  }, []);

  const handleSaveBox = (data: any, mode: 'create' | 'ABIERTA' | 'CERRADA') => {
    if (mode === 'create') {
      store.dispatch(
        createBox({
          ...data,
          sucursalId: branchesID?.sucursalId?._id as string,
          usuarioAperturaId: branchesID?._id as string,
        })
      );
    } else if (mode === 'ABIERTA') {
      store.dispatch(
        openBoxes({
          cajaId: data.cajaId,
          usuarioAperturaId: branchesID?._id as string,
          montoInicial: data.montoInicial,
        })
      );
    } else if (mode === 'CERRADA') {
      store.dispatch(
        closeBoxes({
          cajaId: data.cajaId,
          usuarioArqueoId: data.usuarioArqueoId,
          montoFinalDeclarado: data.montoFinalDeclarado,
          closeWithoutCounting: data.closeWithoutCounting,
        })
      );
    }

    setIsDialogOpen(false);
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
