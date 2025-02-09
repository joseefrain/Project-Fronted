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
        <Button
          variant="default"
          size="sm"
          className="flex items-center gap-2 px-3 py-2 text-sm md:text-base md:px-4 md:py-2"
        >
          Devolución
          <Undo2 className="w-4 h-4 md:w-5 md:h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="container-DialogContent">
        <DialogHeader className="container-DialogContent__into">
          <DialogTitle className="text-lg font-bold sm:text-xl md:text-2xl dark:text-white">
            Devolución de productos
          </DialogTitle>
          <DialogDescription className="text-sm text-black sm:text-base dark:text-white">
            Gestione las devoluciones de productos de manera eficiente
          </DialogDescription>
        </DialogHeader>
        <SalesReturnPage saleDetails={sale} setShowModal={setShowModal} />
      </DialogContent>
    </Dialog>
  );
};
