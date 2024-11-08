import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreVertical, Pencil, Trash } from 'lucide-react';
import { IBranchProps } from '@/interfaces/branchInterfaces';
import { store } from '@/app/store';
import { deleteBranch } from '@/app/slices/branchSlice';
import { useNavigate } from 'react-router-dom';
import React from 'react';

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
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
            {branch.nombre[0]}
          </div>
          <div>
            <h3 className="font-semibold">{branch.nombre}</h3>
            <p className="text-sm text-muted-foreground">{branch.ciudad}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(event) => {
                event.stopPropagation();
                onEdit(true);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(event) => {
                event.stopPropagation();
                handleOnDelete(branch._id!);
              }}
            >
              <Trash className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="mt-2">
          <h4 className="text-sm font-semibold">Datos</h4>
          <p className="text-sm text-muted-foreground">{branch.direccion}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-between gap-2"></CardFooter>
    </Card>
  );
};
