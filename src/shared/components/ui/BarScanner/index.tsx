import React, { useEffect, useRef, useState } from 'react';
import './styles.scss';

interface BarcodeScannerProps {
  onBarcodeScanned: (barcode: string) => void; 
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onBarcodeScanned,
}) => {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [barcode, setBarcode] = useState(''); 
  const [isScanning, setIsScanning] = useState(true); 
  const [isCodeComplete, setIsCodeComplete] = useState(false); 

  useEffect(() => {
    if (scannerRef.current && isScanning) {
      scannerRef.current.focus();
    }
  }, [isScanning]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    event.stopPropagation();
    if (!isScanning) return;
    if (event.key === 'Enter') {
      if (barcode.trim() !== '') {
        setIsCodeComplete(true); 
        onBarcodeScanned(barcode); 
        setIsScanning(false); 
      }
    } else {
      setBarcode((prev) => prev + event.key);
      setIsCodeComplete(false); 
    }
  };

  return (
    <div
      ref={scannerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className='barcode-scanner'
      style={{
        opacity: isScanning ? 1 : 0.5,
      }}
    >
      <p className='barcode-scanner_title'>
        Código de Barra:
        <strong>
          {isCodeComplete ? barcode : 'No se ha escaneado ningún código'}
        </strong>
      </p>
      {!isScanning && <p>Escaneo completado, no se puede escanear más.</p>}
    </div>
  );
};
