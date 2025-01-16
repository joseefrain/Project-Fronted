import { deleteGroupSlice } from '@/app/slices/groups';
import { store } from '@/app/store';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ICategoriesProps } from '@/interfaces/branchInterfaces';
import { MoreVertical, Pencil, Trash } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../components/ui/tooltip';

export const CategoriesCard = ({
  categoriesData,
  onEdit,
  handleSelectCategory,
}: ICategoriesProps) => {
  const navigate = useNavigate();
  const handleOnDelete = () => {
    store.dispatch(deleteGroupSlice(categoriesData._id as string));
    toast.success('Categoria eliminada exitosamente');
  };

  const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      navigate(`/groups/${categoriesData._id}/products`);
    }
  };

  return (
    <>
      <Card
        onClick={handleCardClick}
        key={categoriesData._id}
        className="flex flex-col justify-between font-onest w-[300px] h-[160px] space-y-2"
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <div
            onClick={() => {
              navigate(`/groups/${categoriesData._id}/products`);
              handleSelectCategory(categoriesData);
            }}
            className="flex items-center space-x-2"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
              {categoriesData.nombre[0]}
            </div>
            <div>
              <h3 className="font-semibold">{categoriesData.nombre}</h3>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="font-onest">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => onEdit(true)}>
                <Pencil className="w-4 h-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleOnDelete()}>
                <Trash className="w-4 h-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium"></div>
          <div className="mt-2">
            <h4 className="text-sm font-semibold">Datos</h4>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="w-64 overflow-hidden whitespace-nowrap text-ellipsis text-start p-0 font-onest text-sm text-muted-foreground">
                  {categoriesData.descripcion}
                </TooltipTrigger>
                <TooltipContent>{categoriesData.descripcion}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap justify-between gap-2"></CardFooter>
      </Card>
    </>
  );
};
