import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { PlusCircle, Search, Waypoints } from 'lucide-react';
import RoleTable from '../Table/RoleTable';
import { store } from '../../../app/store';
import { createRole, getRoles } from '../../../app/slices/roleSlice';
import { SearchComponent } from '../../../shared/components/ui/Search';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import RoleModal from './RoleModal';
import { IRole, ROLE } from '../../../interfaces/roleInterfaces';
import { Toaster, toast } from 'sonner';
import { useAppSelector } from '../../../app/hooks';
import Pagination from '../../../shared/components/ui/Pagination/Pagination';
import './styles.scss';
import { useRoleAccess } from '../../../shared/hooks/useRoleAccess';
import { PAGES_MODULES } from '../../../shared/helpers/roleHelper';

export const Roles = () => {
  const access = useRoleAccess(PAGES_MODULES.ROLES);
  const params = useParams();
  const roles = useAppSelector((state) => state.roles.roles);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      role.name.toUpperCase() !== ROLE.ROOT
  );

  const handleOnCreateRole = (role: IRole) => {
    const request = store
      .dispatch(createRole(role))
      .unwrap()
      .catch(() => {
        return Promise.reject();
      })
      .then(() => {
        setIsModalOpen(false);
      });

    toast.promise(request, {
      loading: 'Creando rol...',
      success: 'Rol creado exitosamente',
      error: 'Error al crear rol',
    });
  };

  const pagination = useMemo(() => {
    const totalPages = Math.ceil(roles.length / 10);
    return {
      currentPage,
      totalPages,
    };
  }, [currentPage, roles]);

  useEffect(() => {
    store.dispatch(getRoles()).unwrap();
  }, [params.id]);

  return (
    <div className="container h-auto mx-auto space-y-6 max-h-[75vh]">
      <div className="flex items-center justify-between">
        <h1 className="mb-2.5 text-4xl font-bold text-gray-800 font-onest">
          Roles
        </h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Waypoints size={20} />

            <CardTitle className="font-onest">Roles</CardTitle>
          </div>

          <CardDescription className="font-onest">
            Gestione sus roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between w-full">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <SearchComponent
                searchTerm={searchTerm}
                placeholder="Buscar roles..."
                setSearchTerm={setSearchTerm}
              />
            </div>

            {access.create && (
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="font-onest">Agregar</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="font-onest">
                  <RoleModal
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleOnCreateRole}
                    role={null}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>

          {filteredRoles.length === 0 ? (
            <span className="flex justify-center w-full text-sm text-center text-muted-foreground font-onest">
              No hay roles creados
            </span>
          ) : (
            <RoleTable roles={filteredRoles} access={access} />
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
          />
        </CardFooter>
      </Card>

      <Toaster richColors position="bottom-right" />
    </div>
  );
};
