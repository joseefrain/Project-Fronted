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
  change: string;
  totalDiscount: string;
}

const formatProductLines = (name: string, maxWidth: number) => {
  const words = name.split(' ');
  let lines: string[] = [];
  let currentLine = '';

  words.forEach((word) => {
    if ((currentLine + word).length <= maxWidth) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine) lines.push(currentLine);
  return lines;
};

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
  change,
  totalDiscount,
}: IPOSTicketGenerator) => {
  const printFrame = useRef<HTMLIFrameElement>(null);
  const typeClient = products[0]?.clientType ?? '';
  const generateTicketText = (): string => {
    const lineBreak = '---------------------------------------------------';
    const space = ' '.repeat(40);
    const center = (text: string, width = 40) =>
      text.padStart((width - text.length) / 2 + text.length).padEnd(width);

    let ticketText = `
${center('ZONA CONEXION', 55)}
${center('COMOAPA, BOACO', 55)}
${center('(505) 77041065', 55)}
${lineBreak}
Transaccion: ${transactionId}
${lineBreak}

Fecha: ${fechaHora}
Sucursal: ${Branchs}
Cajero: ${cashierName}
Cliente: ${Cliente}
Metodo de Pago: ${metodoPago}
${typeClient ? `Tipo de Cliente: ${typeClient}\n` : tipoCredit ? '' : ''}
${lineBreak}
${'Producto'.padEnd(27)}${'Cant.'.padStart(11)}${'Precio'.padStart(10)}
${lineBreak}

${products
  .map((product) => {
    const productLines = formatProductLines(product.productName, 30);
    return productLines
      .map((line, index) =>
        index === 0
          ? `${line.padEnd(30)}${`x${product.quantity}`.padStart(6)}${product.price.toFixed(2).padStart(13)}`
          : `${line.padEnd(30)}`
      )
      .join('\n');
  })
  .join('\n')}

${lineBreak}
EFECTIVO: ${`C${efectivoRecibido}`.padStart(37)}
CAMBIO: ${`C$${change}`.padStart(41)}
${totalDiscount ? `DESCUENTO TOTAL: ${`C$${totalDiscount}`.padStart(32)}` : ''}
TOTAL: ${`C${total}`.padStart(43)}
${lineBreak}
${space}
${space}
${center('Gracias por su Preferencia', 55)}
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
