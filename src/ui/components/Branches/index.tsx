import { useAppSelector } from '@/app/hooks';
import {
  createBranchs,
  fetchBranches,
  setSelectedBranch,
  updateBranchs,
} from '@/app/slices/branchSlice';
import { store } from '@/app/store';
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
import { Branch } from '@/interfaces/branchInterfaces';
import { Label } from '@radix-ui/react-label';
import { Store } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { BranchCard } from './BranchCard';
import { useRoleAccess } from '../../../shared/hooks/useRoleAccess';
import { PAGES_MODULES } from '../../../shared/helpers/roleHelper';

export default function BranchDashboard() {
  const access = useRoleAccess(PAGES_MODULES.SUCURSALES);

  const branches = useAppSelector((state) => state.branches.data);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSucursal, setEditingSucursal] = useState(false);
  const [newBranch, setNewBranch] = useState<Branch>({
    pais: '',
    ciudad: '',
    nombre: '',
    telefono: '',
    direccion: '',
    description: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    store.dispatch(fetchBranches()).unwrap();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewBranch({
      ...newBranch,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveNew = async () => {
    try {
      await store.dispatch(createBranchs(newBranch)).unwrap();
      setIsDialogOpen(false);
      setNewBranch({
        pais: '',
        ciudad: '',
        nombre: '',
        telefono: '',
        direccion: '',
        description: '',
      });
      toast.success(`Sucursal ${newBranch.nombre} creada exitosamente`);
    } catch (error) {
      toast.error('Error al crear sucursal: ' + error);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const payload = { branch: newBranch, id };
      await store.dispatch(updateBranchs(payload)).unwrap();
      setIsDialogOpen(false);
      setNewBranch({
        pais: '',
        ciudad: '',
        nombre: '',
        telefono: '',
        direccion: '',
        description: '',
      });
      toast.success(`Sucursal ${newBranch.nombre} editada exitosamente`);
    } catch (error) {
      toast.error('Error al editar sucursal: ' + error);
    }
  };

  const openDialog = (isEdit: boolean, branch?: Branch) => {
    setEditingSucursal(isEdit);
    if (branch) {
      setNewBranch(branch); // Carga los datos existentes
    } else {
      setNewBranch({
        pais: '',
        ciudad: '',
        nombre: '',
        telefono: '',
        direccion: '',
        description: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSelectBranch = (branch: Branch) => {
    store.dispatch(setSelectedBranch(branch));
  };

  const filteredBranches = branches.filter((branch) =>
    branch.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Toaster richColors position="bottom-right" />
      <div className="container mx-auto ">
        <h1 className="text-4xl font-bold text-gray-800 mb-9 font-onest dark:text-white">
          Sucursales
        </h1>
        <nav className="flex flex-col mb-6 space-y-8 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Buscar sucursal..."
              className="w-full sm:w-96 font-onest"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
            {access.create && (
              <Button
                onClick={() => openDialog(false)}
                className="w-full sm:w-auto font-onest dark:bg-[#09090b] dark:text-white dark:border-gray-700"
              >
                <Store className="w-4 h-4 mr-2" />
                Agregar Sucursal
              </Button>
            )}
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
              <DialogTitle className="font-onest">
                {editingSucursal ? 'Editar Sucursal' : 'Agregar Nueva Sucursal'}
              </DialogTitle>
              <DialogDescription className="font-onest">
                {editingSucursal
                  ? 'Modifica los detalles de la sucursal aquí.'
                  : 'Ingresa los detalles de la nueva sucursal.'}
              </DialogDescription>
            </DialogHeader>

            <Label htmlFor="nombre" className="font-onest">
              Nombre
            </Label>
            <Input
              id="nombre"
              name="nombre"
              value={newBranch.nombre}
              onChange={handleInputChange}
              placeholder="Nombre de la sucursal"
              className="font-onest"
            />
            <Label htmlFor="direccion" className="font-onest">
              Dirección
            </Label>
            <Input
              id="direccion"
              name="direccion"
              value={newBranch.direccion}
              onChange={handleInputChange}
              placeholder="Dirección de la sucursal"
              className="font-onest"
            />
            <Label htmlFor="ciudad" className="font-onest">
              Ciudad
            </Label>
            <Input
              id="ciudad"
              name="ciudad"
              value={newBranch.ciudad}
              onChange={handleInputChange}
              placeholder="Ciudad de la sucursal"
              className="font-onest"
            />
            <Label htmlFor="pais" className="font-onest">
              País
            </Label>
            <Input
              id="pais"
              name="pais"
              value={newBranch.pais}
              onChange={handleInputChange}
              placeholder="País de la sucursal"
              className="font-onest"
            />
            <Label htmlFor="telefono" className="font-onest">
              Teléfono
            </Label>
            <Input
              id="telefono"
              name="telefono"
              value={newBranch.telefono}
              onChange={handleInputChange}
              placeholder="Teléfono de la sucursal"
              className="font-onest"
            />

            <DialogFooter>
              <Button
                type="submit"
                onClick={() => {
                  if (editingSucursal) {
                    handleEdit(newBranch._id!);
                  } else {
                    handleSaveNew();
                  }
                }}
                className="font-onest"
              >
                Guardar cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBranches.length > 0 &&
            filteredBranches.map((branch) => (
              <BranchCard
                key={branch._id}
                branch={branch}
                handleSelectBranch={handleSelectBranch}
                onEdit={() => openDialog(true, branch)}
                access={access}
              />
            ))}
        </div>
      </div>
    </>
  );
}
