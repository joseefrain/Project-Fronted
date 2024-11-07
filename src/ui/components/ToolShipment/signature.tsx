import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Pen, SignatureIcon, Trash2 } from 'lucide-react';

export interface ISignature {
  handleSignature: (signature: string | null) => void;
  savedSignature?: string | null;
  canvasWidth?: number;
  canvasHeight?: number;
  buttonText?: string;
  title?: string;
}

export default function Signature({
  savedSignature = null,
  handleSignature,
  canvasWidth = 350,
  canvasHeight = 200,
  buttonText = 'FIRMA',
  title = 'Dibuje su firma',
}: ISignature) {
  const [isOpen, setIsOpen] = useState(false);
  const [firma, setFirma] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const dataURL = canvas.toDataURL();
      setFirma(dataURL);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const eliminarFirma = () => {
    setFirma(null);
    handleSignature(null);
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const guardar = () => {
    setIsOpen(false);
    handleSignature(firma);
  };

  const handleOpen = (open: boolean) => setIsOpen(open);

  return (
    <Popover open={isOpen} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {!savedSignature ? (
            <Pen className="w-4 h-4 mr-1" />
          ) : (
            <SignatureIcon className="w-4 h-4" />
          )}
          {buttonText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" side="top">
        <Card className="border-0 shadow-none">
          <CardHeader className="flex flex-row items-center pb-2 space-x-2">
            <div className="flex items-center justify-center w-8 h-8 font-semibold rounded-full bg-primary text-primary-foreground">
              A
            </div>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-2 mb-2 border rounded-md">
              {savedSignature ? (
                <img src={savedSignature} alt="firma" className="w-full" />
              ) : (
                <canvas
                  ref={canvasRef}
                  width={canvasWidth}
                  height={canvasHeight}
                  onMouseDown={startDrawing}
                  onMouseUp={stopDrawing}
                  onMouseMove={draw}
                  className="border rounded cursor-crosshair"
                />
              )}
            </div>
            {savedSignature && (
              <Button
                variant="outline"
                size="sm"
                onClick={eliminarFirma}
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Eliminar firma
              </Button>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
            <Button size="sm" onClick={guardar}>
              Guardar
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
