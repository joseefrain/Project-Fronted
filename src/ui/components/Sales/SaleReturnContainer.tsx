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
      <DialogContent className="max-w-4xl p-0 border-0">
        <DialogHeader className="p-6 pb-0 text-black rounded-t font-onest bg-gradient-to-b from-sky-50 to-white">
          <DialogTitle className="text-2xl font-bold">
            Devolución de productos
          </DialogTitle>
          <DialogDescription className="text-black">
            Gestione las devoluciones de productos de manera eficiente
          </DialogDescription>
        </DialogHeader>
        <SalesReturnPage saleDetails={sale} setShowModal={setShowModal} />
      </DialogContent>
    </Dialog>
  );
};
