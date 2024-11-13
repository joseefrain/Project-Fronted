import { ChangeEvent, useEffect, useState } from 'react';
import { Store } from 'lucide-react';
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
import { BranchCard } from './BranchCard';
import { store } from '@/app/store';
import {
  createBranchs,
  fetchBranches,
  setSelectedBranch,
} from '@/app/slices/branchSlice';
import { useAppSelector } from '@/app/hooks';
import { Label } from '@radix-ui/react-label';
import { toast, Toaster } from 'sonner';
import { Branch } from '@/interfaces/branchInterfaces';
import { Typography } from '@/shared/components/ui/Typography';

export default function BranchDashboard() {
  const branches = useAppSelector((state) => state.branches.data);
  const userRoles = useAppSelector((state) => state.auth.signIn.user);
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

  const openDialog = (isEdit: boolean) => {
    setEditingSucursal(isEdit);
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
        <div className="flex items-center w-full gap-3">
          <Store size={40} />
          <Typography component="h2" className="mb-4 font-medium text-black">
            Sucursales
          </Typography>
        </div>

        <br />
        <nav className="flex flex-col mb-6 space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Buscar por nombre de la sucursal"
              className="w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
            {userRoles?.role !== 'admin' && (
              <Button
                onClick={() => openDialog(false)}
                className="w-full sm:w-auto"
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
              <DialogTitle>
                {editingSucursal ? 'Editar Sucursal' : 'Agregar Nueva Sucursal'}
              </DialogTitle>
              <DialogDescription>
                {editingSucursal
                  ? 'Modifica los detalles de la sucursal aquí.'
                  : 'Ingresa los detalles de la nueva sucursal.'}
              </DialogDescription>
            </DialogHeader>

            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              name="nombre"
              value={newBranch.nombre}
              onChange={handleInputChange}
              placeholder="Nombre de la sucursal"
            />
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              name="direccion"
              value={newBranch.direccion}
              onChange={handleInputChange}
              placeholder="Dirección de la sucursal"
            />
            <Label htmlFor="ciudad">Ciudad</Label>
            <Input
              id="ciudad"
              name="ciudad"
              value={newBranch.ciudad}
              onChange={handleInputChange}
              placeholder="Ciudad de la sucursal"
            />
            <Label htmlFor="pais">País</Label>
            <Input
              id="pais"
              name="pais"
              value={newBranch.pais}
              onChange={handleInputChange}
              placeholder="País de la sucursal"
            />
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              name="telefono"
              value={newBranch.telefono}
              onChange={handleInputChange}
              placeholder="Teléfono de la sucursal"
            />

            <DialogFooter>
              <Button
                type="submit"
                onClick={() => {
                  if (editingSucursal) {
                    //   handleEdit(newBranch?._id);
                  } else {
                    handleSaveNew();
                  }
                }}
              >
                Guardar cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBranches.length > 0 &&
            filteredBranches.map((branch) => (
              <BranchCard
                key={branch._id}
                branch={branch}
                handleSelectBranch={handleSelectBranch}
                onEdit={() => openDialog(true)}
              />
            ))}
        </div>
      </div>
    </>
  );
}
