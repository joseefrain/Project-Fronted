import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LockKeyhole, LockKeyholeOpen, MoreVertical } from 'lucide-react';

interface ActionCashierProps {
  isOpenBox: boolean;
  openModal: () => void;
}

const ActionCashier = ({ isOpenBox, openModal }: ActionCashierProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="flex flex-col gap-1">
        <DropdownMenuLabel className="font-onest">Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {!isOpenBox ? (
          <DropdownMenuItem
            onClick={openModal}
            className="flex items-center font-onest"
          >
            <LockKeyholeOpen className="w-4 h-4 mr-2" />
            Abrir
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={openModal}
            className="flex items-center font-onest"
          >
            <LockKeyhole className="w-4 h-4 mr-2" />
            Cerrar
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionCashier;
