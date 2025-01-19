import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '../../../components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import RoleModal from '../Roles/RoleModal';
import {
  IRole,
  IRoleAccess,
  IRoleTableProps,
} from '../../../interfaces/roleInterfaces';
import { DialogDescription } from '@radix-ui/react-dialog';
import { removeRole, updatingRole } from '../../../app/slices/roleSlice';
import { store } from '../../../app/store';
import { toast, Toaster } from 'sonner';
import { useAppSelector } from '../../../app/hooks';
import { updateRoleAssigned } from '../../../app/slices/login';

const RoleTable = ({
  roles,
  access,
}: IRoleTableProps & { access: IRoleAccess }) => {
  return (
    <>
      <Table className="font-onest">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Nombre del rol</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <RoleTableRow key={role._id} role={role} access={access} />
          ))}
        </TableBody>
      </Table>
      <Toaster richColors position="bottom-right" />
    </>
  );
};

export default RoleTable;

export const RoleTableRow = ({
  role,
  access,
}: {
  role: IRole;
  access: IRoleAccess;
}) => {
  const user = useAppSelector((state) => state.auth.signIn.user);
  const isRoleAssignedToUser = user?.roles.find(
    (role) => role._id === role._id
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOnRemoveRole = (id: string) => {
    const request = store
      .dispatch(removeRole(id))
      .unwrap()
      .catch(() => {
        return Promise.reject();
      })
      .then(() => {
        setIsDeleting(false);
      });

    toast.promise(request, {
      loading: 'Eliminando rol...',
      success: 'Rol eliminado exitosamente',
      error: 'Error al eliminar rol',
    });
  };

  const handleOnUpdateRole = (updatedRole: IRole) => {
    const request = store
      .dispatch(updatingRole(updatedRole))
      .unwrap()
      .catch(() => {
        return Promise.reject();
      })
      .then(() => {
        if (isRoleAssignedToUser) {
          store.dispatch(updateRoleAssigned(updatedRole));
        }

        setIsEditing(false);
      });

    toast.promise(request, {
      loading: 'Actualizando rol...',
      success: 'Rol actualizado exitosamente',
      error: 'Error al actualizar rol',
    });
  };

  return (
    <TableRow key={role._id}>
      <TableCell className="text-center">{role.name}</TableCell>
      <TableCell className="flex items-center gap-2">
        {access.update && (
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button className="w-8 h-8" variant="outline">
                <Pencil className="w-4 h-4 text-blue-600" />
              </Button>
            </DialogTrigger>
            <DialogContent className="font-onest">
              <RoleModal
                onClose={() => setIsEditing(false)}
                onSave={handleOnUpdateRole}
                role={role}
              />
            </DialogContent>
          </Dialog>
        )}

        {access.delete && (
          <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
            <DialogTrigger asChild>
              <Button className="w-8 h-8" variant="outline">
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col font-onest">
              <DialogHeader className="">
                <DialogTitle className="font-semibold uppercase">
                  {`Eliminar ${role.name}`}
                </DialogTitle>
              </DialogHeader>
              <DialogDescription>
                ¿Está seguro de que desea eliminar este rol?
              </DialogDescription>
              <DialogFooter>
                <Button
                  className="w-full text-white bg-gray-400 hover:bg-gray-600"
                  onClick={() => setIsDeleting(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="w-full text-white bg-red-600 hover:bg-red-700"
                  onClick={() => handleOnRemoveRole(role._id)}
                >
                  Eliminar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        <Dialog open={isViewing} onOpenChange={setIsViewing}>
          <DialogTrigger asChild>
            <Button className="w-8 h-8" variant="outline">
              <Eye className="w-4 h-4 text-green-600" />
            </Button>
          </DialogTrigger>
          <DialogContent className="font-onest">
            <RoleModal
              onClose={() => setIsViewing(false)}
              onSave={() => null}
              role={role}
              readonly
            />
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};
