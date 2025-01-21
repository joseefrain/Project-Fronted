import { LockKeyhole, LockKeyholeOpen, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ICajaBrach } from '../../../app/slices/cashRegisterSlice';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { toast } from 'sonner';
import { useState } from 'react';
import { ModalHistory } from './box-history';
import { IRoleAccess } from '../../../interfaces/roleInterfaces';
import { IUser } from '@/app/slices/login';

interface BoxCardProps {
  box: ICajaBrach;
  onOpen: () => void;
  onClose: () => void;
}

export function BoxCard({
  box,
  access,
  onOpen,
  onClose,
}: BoxCardProps & { access: IRoleAccess }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isOpen = box.estado === 'ABIERTA';
  const isClosed = box.estado === 'CERRADA';

  const handleOpen = () => {
    // const storedBoxes = localStorage.getItem('boxState');

    // if (storedBoxes) {
    //   const boxes = JSON.parse(storedBoxes);

    //   const openedBox = boxes.find((box: any) => box.estado === 'ABIERTA');

    //   if (openedBox && openedBox.id !== box._id) {
    //     toast.error(`Solo se puede abrir una caja a la vez, por usuario`);
    //     return;
    //   }
    // }

    onOpen();
  };

  const handleClose = () => {
    onClose();
  };

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  return (
    <>
      <Card
        key={box._id}
        className="relative overflow-hidden transition-all bg-white group hover:shadow-lg dark:bg-neutral-950"
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <div
            onClick={handleCardClick}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10"
          >
            <span className="text-xl font-bold text-primary">
              {box.consecutivo}
            </span>
          </div>
          {access.update && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="flex flex-col gap-1">
                <DropdownMenuLabel className="font-onest">
                  Acciones
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {!isOpen && (
                  <DropdownMenuItem
                    onClick={handleOpen}
                    className="flex items-center font-onest"
                  >
                    <LockKeyholeOpen className="w-4 h-4 mr-2" />
                    Abrir
                  </DropdownMenuItem>
                )}
                {!isClosed && (
                  <DropdownMenuItem
                    onClick={handleClose}
                    className="flex items-center font-onest"
                  >
                    <LockKeyhole className="w-4 h-4 mr-2" />
                    Cerrar
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardHeader>
        <CardContent>
          <p
            className={`mt-2 text-sm ${box.estado === 'ABIERTA' ? 'text-green-500' : 'text-red-500'}`}
          >
            Estado: {box.estado}
          </p>
          {
            box.estado === 'ABIERTA' && (
              <>
              <p
            className={`mt-2 text-sm ${box.estado === 'ABIERTA' ? 'text-green-500' : 'text-red-500'}`}
          >
            Usuario: {(box.usuarioAperturaId as IUser).username}
          </p>
          <p
            className={`mt-2 text-sm ${box.estado === 'ABIERTA' ? 'text-green-500' : 'text-red-500'}`}
          >
            Saldo: {box.montoEsperado.$numberDecimal}
          </p>
              </>
            )
          }
          
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground">
              Caja #{box.consecutivo}
            </span>
          </div>
        </CardContent>
      </Card>

      {isModalOpen && (
        <>
          <ModalHistory data={box} isOpen={isModalOpen} onClose={closeModal} />
        </>
      )}
    </>
  );
}
