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
  Branchs: string;
  Cliente: string;
  Cajero: string;
  fechaHora: string;
  metodoPago: string;
  efectivoRecibido: string;
  tipoCredit: string;
}

export const POSTicketGenerator = ({
  products,
  total,
  transactionId,
  cashierName,
  Branchs,
  Cliente,
  fechaHora,
  metodoPago,
  efectivoRecibido,
  tipoCredit,
}: IPOSTicketGenerator) => {
  const printFrame = useRef<HTMLIFrameElement>(null);

  const generateTicketText = (): string => {
    const lineBreak = '---------------------------------------------';
    const space = ' '.repeat(40);
    const center = (text: string, width = 40) =>
      text.padStart((width - text.length) / 2 + text.length).padEnd(width);

    let ticketText = `
${center('Nichos.CORPS', 45)}
${center('Frente a la Materno Infantil', 45)}
${center('(505) 86349918', 45)}
${lineBreak}
  Transaccion: ${transactionId}
 
${lineBreak}

Cajero: ${cashierName}
Sucursal: ${Branchs}

Cliente: ${Cliente}
Fecha: ${fechaHora}

Metodo de Pago: ${metodoPago}
Efectivo Recibido: ${efectivoRecibido ? efectivoRecibido : '-'} 
${tipoCredit ? `Tipo de Credito: ${tipoCredit}\n` : ''}
${lineBreak}

${'Producto'.padEnd(20)}${'Cant.'.padStart(6)}${'Precio'.padStart(15)}
${lineBreak}

${products
  .map(
    (product) =>
      `${product.productName.slice(0, 20).padEnd(20)} x${product.quantity}${product.price
        .toFixed(2)
        .padStart(20)}`
  )
  .join('\n')}


${lineBreak}
TOTAL: ${total.padStart(37)}
${lineBreak}
${space}
${space}
${center('Gracias por su Compra !', 50)}
`;
    return ticketText;
  };

  const generatePDF = () => {
    const ticketText = generateTicketText();
    const doc = new jsPDF();

    doc.setFont('courier', 'normal');
    doc.setFontSize(10);
    doc.text(ticketText, 10, 10);

    doc.save('ticket.pdf');
  };

  const printTicket = () => {
    const ticketText = generateTicketText();

    if (printFrame.current) {
      const frameDoc = printFrame.current.contentDocument;
      if (frameDoc) {
        frameDoc.body.innerHTML = `<pre>${ticketText}</pre>`;
        frameDoc.close();
        printFrame.current.contentWindow?.print();
      }
    }
  };

  return (
    <div className="flex mt-4 space-x-4">
      <Button onClick={printTicket}>Imprimir Ticket</Button>
      <Button onClick={generatePDF}>Descargar PDF</Button>
      <iframe
        ref={printFrame}
        style={{ display: 'none' }}
        title="print-frame"
      />
    </div>
  );
};
