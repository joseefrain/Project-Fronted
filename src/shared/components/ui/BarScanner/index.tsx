import React, { useEffect, useRef, useState } from 'react';

interface BarcodeScannerProps {
  onBarcodeScanned: (barcode: string) => void; // Función que se llama cuando se escanea un código de barras
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onBarcodeScanned,
}) => {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [barcode, setBarcode] = useState(''); // Código escaneado actual
  const [isScanning, setIsScanning] = useState(true); // Estado para controlar si el escáner está habilitado

  useEffect(() => {
    if (scannerRef.current && isScanning) {
      scannerRef.current.focus();
    }
  }, [isScanning]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    event.stopPropagation();
    if (!isScanning) return; // Si el escáner está deshabilitado, no procesamos más teclas

    if (event.key === 'Enter') {
      if (barcode.trim() !== '') {
        onBarcodeScanned(barcode); // Llamar a la función que pasa como propiedad
        setIsScanning(false); // Desactivar el escáner después de escanear
      }
    } else {
      setBarcode((prev) => prev + event.key); // Construir el código de barras
    }
  };

  return (
    <div
      ref={scannerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{
        border: '1px solid #ccc',
        padding: '20px',
        maxWidth: '400px',
        margin: '0 auto',
        textAlign: 'center',
        opacity: isScanning ? 1 : 0.5, // Cambiar opacidad si está deshabilitado
      }}
    >
      <h2>Escáner de Código de Barras</h2>
      <p>Escanea un código de barras con la pistola.</p>
      <p>
        Código actual: <strong>{barcode}</strong>
      </p>
      {!isScanning && <p>Escaneo completado, no se puede escanear más.</p>}{' '}
      {/* Mensaje cuando no se puede escanear más */}
    </div>
  );
};
