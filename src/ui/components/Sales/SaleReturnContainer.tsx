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
import { ISale } from '../../../interfaces/salesInterfaces';
import { useState } from 'react';
import SalesReturnPage from './SaleReturnPage';

export const SaleReturnContainer = ({ sale }: { sale: ISale }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          Devolver
          <Undo2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl p-0 border-0 dark:bg-gray-800">
        <DialogHeader className="p-6 pb-0 text-black rounded-t font-onest bg-gradient-to-b from-sky-50 to-white dark:from-gray-800">
          <DialogTitle className="text-2xl font-bold dark:text-white">
            Devolución de productos
          </DialogTitle>
          <DialogDescription className="text-black dark:text-white">
            Gestione las devoluciones de productos de manera eficiente
          </DialogDescription>
        </DialogHeader>
        <SalesReturnPage saleDetails={sale} setShowModal={setShowModal} />
      </DialogContent>
    </Dialog>
  );
};
