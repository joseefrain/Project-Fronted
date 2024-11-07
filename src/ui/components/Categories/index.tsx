import { useEffect, useState } from 'react';
import { ChartColumnStacked, Group } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { CategoriesCard } from './Categories';
import { store } from '@/app/store';
import { useAppSelector } from '@/app/hooks';
import { Label } from '@radix-ui/react-label';
import {
  AddingGroups,
  createGroupSlice,
  getAllGroupsSlice,
  setSelectCategory,
} from '@/app/slices/groups';
import { unwrapResult } from '@reduxjs/toolkit';
import { toast, Toaster } from 'sonner';
import { IProductoGroups } from '@/interfaces/branchInterfaces';
import { Typography } from '@/shared/components/ui/Typography';

export default function Categories() {
  const categories = useAppSelector((state) => state.categories.groups);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSucursal, setEditingSucursal] = useState(false);
  const [groups, setGroups] = useState<IProductoGroups>({
    nombre: '',
    descripcion: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    store.dispatch(getAllGroupsSlice()).unwrap();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroups({
      ...groups,
      [e.target.name]: e.target.value,
    });
  };
  const handleAddGroup = async (groups: IProductoGroups) => {
    try {
      const resultAction = await store.dispatch(createGroupSlice(groups));
      const result = unwrapResult(resultAction);
      store.dispatch(AddingGroups(result));
      toast.success('Categoria creado exitosamente');
    } catch (error) {
      toast.error(error as string);
    }
  };

  const handleEdit = (id: string) => {
    // store.dispatch(updateBranchs({ branch: newBranch, id }));
    setEditingSucursal(true);
    setIsDialogOpen(true);
  };

  const openDialog = (isEdit: boolean) => {
    setEditingSucursal(isEdit);
    setIsDialogOpen(true);
  };

  const handleSelectCategory = (cat: IProductoGroups) => {
    store.dispatch(setSelectCategory(cat));
  };

  const filteredCategories = categories.filter((branch) =>
    branch.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Toaster richColors position="bottom-right" />
      <div className="container mx-auto ">
        <div className="flex items-center w-full gap-3">
          <Group size={40} />
          <Typography component="h2" className="mb-4 font-medium text-black">
            Categorías
          </Typography>
        </div>
        <br />
        <nav className="flex flex-col mb-6 space-y-4 sm:flex-row sm:items-center gap-5 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Buscar por nombre de la categorias"
              className="w-full sm:w-[34.5rem]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
            <Button
              onClick={() => openDialog(false)}
              className="w-full sm:w-auto"
            >
              <ChartColumnStacked className="mr-2 h-4 w-4" />
              Agregar Categoria
            </Button>
          </div>
        </nav>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingSucursal(false);
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSucursal
                  ? 'Editar Categorias'
                  : 'Agregar Nueva Categorias'}
              </DialogTitle>
              <DialogDescription>
                {editingSucursal
                  ? 'Modifica los detalles de la Categorias aquí.'
                  : 'Ingresa los detalles de la nueva Categorias.'}
              </DialogDescription>
            </DialogHeader>

            <Label htmlFor="nombre">Nombre</Label>
            <Input
              type="text"
              id="nombre"
              name="nombre"
              value={groups.nombre}
              onChange={handleInputChange}
              required
            />

            <Label htmlFor="descripcion">Descripcion</Label>
            <Input
              type="descripcion"
              id="descripcion"
              name="descripcion"
              value={groups.descripcion}
              onChange={handleInputChange}
              required
            />

            <DialogFooter>
              <Button
                type="submit"
                onClick={() => {
                  if (editingSucursal) {
                    //   handleEdit(newBranch?._id);
                  } else {
                    handleAddGroup(groups);
                  }
                }}
              >
                Guardar cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="flex flex-row flex-wrap gap-4">
          {filteredCategories.length > 0 &&
            filteredCategories.map((branch) => (
              <CategoriesCard
                key={branch._id}
                categoriesData={branch}
                handleSelectCategory={handleSelectCategory}
                onEdit={() => openDialog(true)}
              />
            ))}
        </div>
      </div>
    </>
  );
}
