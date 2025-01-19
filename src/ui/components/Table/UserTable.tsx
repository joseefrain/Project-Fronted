import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IUserTableProps } from '../../../interfaces/userInterfaces';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { deletingUser } from '../../../app/slices/userSlice';
import { toast, Toaster } from 'sonner';
import { store } from '../../../app/store';
import { IUser } from '../../../app/slices/login';
import RegisterForm from '../Login/RegisterForm';

export const UserTable = ({ users }: IUserTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="w-fit">Sucursal</TableHead>
          <TableHead>Roles</TableHead>
          <TableHead className="flex items-center justify-center">
            <span className="">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users?.map((user, index) => <UserTableRow key={index} user={user} />)}
      </TableBody>
    </Table>
  );
};

export const UserTableRow = ({ user }: { user: IUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteUser = (id: string) => {
    const request = store
      .dispatch(deletingUser(id))
      .unwrap()
      .catch(() => {
        return Promise.reject();
      })
      .then(() => {
        setIsDeleting(false);
      });

    toast.promise(request, {
      loading: 'Eliminando usuario...',
      success: 'Usuario eliminado exitosamente',
      error: 'Error al eliminar usuario',
    });
  };

  return (
    <TableRow key={user._id}>
      <TableCell className="font-medium">{user.username}</TableCell>
      <TableCell>{user.sucursalId?.nombre ?? '-'}</TableCell>
      <TableCell className="truncate max-w-[20px]">
        {user.roles.map((role) => role.name).join(', ')}{' '}
      </TableCell>
      <TableCell className="flex items-center justify-center gap-3">
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button className="w-8 h-8" variant="outline">
              <Pencil className="w-4 h-4 text-blue-600" />
            </Button>
          </DialogTrigger>
          <DialogContent className="font-onest">
            <RegisterForm user={user} onClose={() => setIsEditing(false)} />
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
          <DialogTrigger asChild>
            <Button className="w-8 h-8" variant="outline">
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          </DialogTrigger>
          <DialogContent className="flex flex-col font-onest">
            <DialogHeader className="">
              <DialogTitle className="font-semibold uppercase">
                {`Eliminar ${user.username}`}
              </DialogTitle>
            </DialogHeader>
            <DialogDescription>
              ¿Está seguro de que desea eliminar este usuario?
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
                onClick={() => handleDeleteUser(user._id)}
              >
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TableCell>
      <Toaster richColors position="bottom-right" />
    </TableRow>
  );
};
