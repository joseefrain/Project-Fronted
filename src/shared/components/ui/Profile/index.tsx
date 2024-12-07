import { useAppSelector } from '@/app/hooks';
import { logout } from '@/app/slices/login';
import { store } from '@/app/store';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DoorClosed, Store } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBranches } from '../../../../app/slices/branchSlice';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog';
import { ModalBranchs } from '../../../../ui/components/ModalBranchs';
import {
  findBranchById,
  getSelectedBranchFromLocalStorage,
} from '../../../helpers/branchHelpers';

export const ProfileUser = () => {
  const user = useAppSelector((state) => state.auth.signIn.user);
  const [, setEditingSucursal] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      store.dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Error trying to logout: ', error);
    }
  };

  const openDialog = (isEdit: boolean) => {
    setEditingSucursal(isEdit);
    setIsDialogOpen(true);
  };

  const selectedBranchFromLocalStorage = getSelectedBranchFromLocalStorage();
  const branches = useAppSelector((state) => state.branches.data);
  const [selectedBranch, setSelectedBranch] = useState<{
    nombre: string;
    _id: string;
  } | null>(null);

  useEffect(() => {
    const branch = findBranchById(branches, selectedBranchFromLocalStorage);
    if (branch) {
      setSelectedBranch({ nombre: branch.nombre, _id: branch._id ?? '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branches]);

  useEffect(() => {
    store.dispatch(fetchBranches()).unwrap();
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
        {user?.role !== 'admin' && (
          <Button
            onClick={() => openDialog(false)}
            className="w-full h-full sm:w-auto font-onest"
          >
            <Store className="w-4 h-4 mr-2" />
            Sucursal
          </Button>
        )}
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
              <DialogTitle>Selecione una sucursal</DialogTitle>
              <DialogDescription>
                <ModalBranchs />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center justify-center gap-2 p-2">
        <div className="flex flex-col items-start justify-center ">
          <h1 className="text-xl font-bold capitalize font-onest">
            {user?.username}
          </h1>
          <p className="text-sm text-muted-foreground font-onest">
            {user?.role} -{' '}
            {selectedBranch ? selectedBranch.nombre : user?.sucursalId?.nombre}
          </p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex items-center justify-center w-10 h-10 text-white bg-black rounded-full cursor-pointer">
              <span className="text-lg font-semibold text-white font-onest">
                {user?.username.charAt(0).toUpperCase() ?? 'A'}
              </span>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-22">
            <Button
              onClick={handleLogout}
              variant="secondary"
              className="font-onest"
            >
              <DoorClosed className="w-4 h-4" />
              Salir
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};
