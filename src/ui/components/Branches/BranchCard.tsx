import { deleteBranch } from '@/app/slices/branchSlice';
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
import { IBranchProps } from '@/interfaces/branchInterfaces';
import { MoreVertical, Pencil, Trash } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const BranchCard = ({
  branch,
  onEdit,
  handleSelectBranch,
}: IBranchProps) => {
  const navigate = useNavigate();

  const handleOnDelete = (id: string) => {
    store.dispatch(deleteBranch(id));
  };

  const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      navigate(`/branches/${branch._id}/products`);
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      key={branch._id}
      className="flex flex-col justify-between "
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div
          onClick={() => {
            navigate(`/branches/${branch._id}/products`);
            handleSelectBranch(branch);
          }}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full font-onest bg-primary text-primary-foreground">
            {branch.nombre[0]}
          </div>
          <div>
            <h3 className="font-semibold font-onest">{branch.nombre}</h3>
            <p className="text-sm text-muted-foreground font-onest">
              {branch.ciudad}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="font-onest">
              Acciones
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(event) => {
                event.stopPropagation();
                onEdit(true);
              }}
              className="font-onest"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(event) => {
                event.stopPropagation();
                handleOnDelete(branch._id!);
              }}
              className="font-onest"
            >
              <Trash className="w-4 h-4 mr-2" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="mt-2">
          <h4 className="text-sm font-semibold font-onest">Datos</h4>
          <p className="text-sm text-muted-foreground font-onest">
            {branch.direccion}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-between gap-2"></CardFooter>
    </Card>
  );
};
