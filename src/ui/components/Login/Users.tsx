import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '@/app/hooks';
import { store } from '@/app/store';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SearchComponent } from '@/shared/components/ui/Search';
import { PlusCircle, User } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '../../../components/ui/dialog';
import Pagination from '../../../shared/components/ui/Pagination/Pagination';
import RegisterForm from './RegisterForm';
import { getUsers } from '../../../app/slices/userSlice';
import { UserTable } from '../Table/UserTable';

export const Users = () => {
  const users = useAppSelector((state) => state.users.users);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.sucursalId?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pagination = useMemo(() => {
    const totalPages = Math.ceil(users.length / 10);
    return {
      currentPage,
      totalPages,
    };
  }, [currentPage, users]);

  useEffect(() => {
    store.dispatch(getUsers()).unwrap();
  }, []);

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-between gap-4 mb-3 sm:flex-row sm:items-center">
        <h1 className="text-4xl font-bold text-gray-800 font-onest">
          Usuarios
        </h1>
      </div>

      <div className="flex flex-col w-full font-onest">
        <main className="flex-1 py-4 md:py-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <User size={20} />
                <CardTitle>Usuarios</CardTitle>
              </div>
              <CardDescription>Gestione todos sus usuarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <SearchComponent
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  placeholder="Buscar usuarios..."
                />
                <Dialog open={isAdding} onOpenChange={setIsAdding}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="h-8 gap-1">
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span>Agregar</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="font-onest">
                    <DialogHeader>
                      <RegisterForm onClose={() => setIsAdding(false)} />
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>

              {filteredUsers.length === 0 ? (
                <span className="flex justify-center w-full text-sm text-center text-muted-foreground">
                  No hay usuarios en esta sucursal
                </span>
              ) : (
                <UserTable users={filteredUsers} />
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
        </main>
      </div>
    </div>
  );
};
