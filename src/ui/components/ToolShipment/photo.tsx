import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Camera, Image, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export interface IImages {
  handleSaveImages?: (images: string[]) => void;
  savedImages: string[];
  className?: string;
  showTitle?: boolean;
  maxImages?: number;
  title?: string;
  readonly?: boolean;
}

export default function Images({
  savedImages,
  handleSaveImages,
  className,
  showTitle,
  maxImages = 6,
  title = 'Fotografía',
  readonly,
}: IImages) {
  const [isOpen, setIsOpen] = useState(false);
  const [fotos, setFotos] = useState<string[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotos((prevFotos) => [...prevFotos, reader.result as string]);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Por favor, selecciona un archivo de imagen.');
    }
  };

  const deleteLastImage = () => setFotos((prevFotos) => prevFotos.slice(0, -1));

  const saveImages = () => {
    handleSaveImages && handleSaveImages(fotos);
    setIsOpen(false);
  };

  useEffect(() => {
    setFotos(savedImages);
  }, [savedImages]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          {savedImages.length > 0 ? (
            <Image className="w-4 h-4" />
          ) : (
            <Camera className="w-4 h-4" />
          )}
          {showTitle && (
            <span className="text-sm font-semibold uppercase hidden lg:block">
              imágenes
            </span>
          )}
          {savedImages.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {savedImages.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" className="w-[350px] p-0 font-onest">
        <Card className="border-0 shadow-none">
          <CardHeader className="flex flex-row items-center pb-2 space-x-2">
            <div className="flex items-center justify-center w-8 h-8 font-semibold rounded-full bg-primary text-primary-foreground">
              A
            </div>
            <CardTitle className="card__title">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-1">
              {fotos.length > 0 ? (
                fotos.map((foto, index) => (
                  <div key={index} className="col-span-1">
                    <img
                      src={foto}
                      alt={`Foto ${index}`}
                      className="object-cover w-full h-full rounded-md"
                    />
                  </div>
                ))
              ) : (
                <span className="pl-1 text-sm text-gray-500 font-onest ">
                  No hay imágenes
                </span>
              )}
            </div>
          </CardContent>
          {readonly ? null : (
            <CardFooter className="flex flex-col space-y-2">
              <div className="flex justify-between w-full">
                {fotos.length < maxImages && (
                  <div className="grid items-center w-[120px]">
                    <Label htmlFor="picture" className="sr-only">
                      Agregar más
                    </Label>
                    <div className="relative">
                      <Input
                        id="picture"
                        type="file"
                        className="sr-only"
                        aria-hidden="true"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      <label
                        htmlFor="picture"
                        className="h-[30px] flex items-center justify-center font-semibold text-xs text-black bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-50 shadow-sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        <span>Agregar más</span>
                      </label>
                    </div>
                  </div>
                )}
                {fotos.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={deleteLastImage}
                    className="w-[130px]"
                  >
                    <Trash2 className="w-4 h-4" /> Eliminar imagen
                  </Button>
                )}
              </div>
              <div className="flex justify-between w-full">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  Cancelar
                </Button>
                <Button size="sm" onClick={saveImages}>
                  Guardar
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </PopoverContent>
    </Popover>
  );
}
