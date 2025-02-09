import { Undo2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog';
import React, { useState } from 'react';
import CreditReturnPage from './CreditReturnPage';
import { ITransacionCredit } from '../../../interfaces/creditsInterfaces';

export const CreditReturnContainer = ({
  credit,
}: {
  credit: ITransacionCredit;
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setShowModal(true);
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" onClick={(e) => handleOpenModal(e)}>
          Devolución
          <Undo2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded overflow-auto max-h-[90vh] flex flex-col p-0 border-0 max-w-[95%] md:max-w-6xl md:max-h-5/6 dark:bg-gray-800">
        <DialogHeader className="p-6 pb-0 text-black rounded-t font-onest bg-gradient-to-b from-sky-50 to-white dark:from-gray-800">
          <DialogTitle className="text-2xl font-bold dark:text-white">
            Devolución de productos
          </DialogTitle>
          <DialogDescription className="text-black dark:text-white">
            Gestione las devoluciones de productos en crédito de manera
            eficiente
          </DialogDescription>
        </DialogHeader>
        <CreditReturnPage credit={credit} setShowModal={setShowModal} />
      </DialogContent>
    </Dialog>
  );
};
