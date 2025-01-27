import { Button } from '@/components/ui/button';
import { IProductSale } from '@/interfaces/salesInterfaces';
import { jsPDF } from 'jspdf';
import { useRef } from 'react';

interface IPOSTicketGenerator {
  products: IProductSale[];
  total: string;
  date: string;
  transactionId: string;
  cashierName: string;
  //
  Branchs: string;
  Cliente: string;
  Cajero: string;
  fechaHora: string;
  metodoPago: string;
  efectivoRecibido: string;
  tipoCredit: string;
  meses: string;
}

export const POSTicketGenerator = ({
  products,
  total,
  date,
  transactionId,
  cashierName,

  Branchs,
  Cliente,
  Cajero,
  fechaHora,
  metodoPago,
  efectivoRecibido,
  tipoCredit,
  meses,
}: IPOSTicketGenerator) => {
  const printFrame = useRef<HTMLIFrameElement>(null);
  const generateTicketText = (): string => {
    let ticketText = `Purchase Ticket***
---------------------------------------------
Fecha: ${date}
Transacción: ${transactionId}

Cajero: ${cashierName}

Sucursal: ${Branchs}

Cliente: ${Cliente}

Cajero: ${Cajero}

Fecha y Hora: ${fechaHora}

Metodo de Pago: ${metodoPago}

Efectivo Recibido: ${efectivoRecibido}

Tipo de Crédito: ${tipoCredit}

Meses: ${meses}


Products:
${products
  .map(
    (product) =>
      `${product.productName.slice(0, 20).padEnd(20)}       x${product.quantity.toString().padStart(2)}       $${product.price.toFixed(2).padStart(6)}\n---------------------------------------------`
  )
  .join('\n')}

Total: ${total}

*                                          *
*                                          *
*                                          *

--------------------------------------------
******************* FIRMA ******************
*                                          *
*                                          *
Gracias por su compra!
***
`;

    return ticketText;
  };

  const generatePDF = () => {
    const ticketText = generateTicketText();
    const doc = new jsPDF();

    // Agrega el texto al PDF
    doc.text(ticketText, 10, 10);

    // Descarga el PDF
    doc.save('ticket.pdf');
  };

  //   const printTicket = () => {
  //     const ticketText = generateTicketText();
  //     if (printFrame.current) {
  //       const frameDoc = printFrame.current.contentDocument;
  //       if (frameDoc) {
  //         frameDoc.body.innerHTML = `<pre>${ticketText}</pre>`;
  //         frameDoc.close();
  //         printFrame.current.contentWindow?.print();
  //       }
  //     }
  //   };

  return (
    <>
      <div className="mt-4 space-x-4">
        <Button onClick={generatePDF}>Download Ticket as PDF</Button>
      </div>
    </>
  );
};
