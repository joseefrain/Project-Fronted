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
import { useEffect, useState } from 'react';
import { deleteEntityById, getEntities } from '../../../app/slices/entities';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '../../../components/ui/dialog';
import { IEntities } from '../../../interfaces/entitiesInterfaces';
import Pagination from '../../../shared/components/ui/Pagination/Pagination';
import { AddContact } from './add';
import { TablaContacts } from './table';
import { useRoleAccess } from '../../../shared/hooks/useRoleAccess';
import { PAGES_MODULES } from '../../../shared/helpers/roleHelper';
import { toast, Toaster } from 'sonner';

interface MainContactsProps {
  filterType: string;
}

export const MainContacts = ({ filterType }: MainContactsProps) => {
  const access = useRoleAccess(PAGES_MODULES.CONTACTOS);
  const allEntities = useAppSelector((state) => state.entities.data);

  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(getEntities()).unwrap();
    };
    fetchData();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredProducts = allEntities
    .filter((product) =>
      filterType === 'contact' ? true : product?.type === filterType
    )
    .filter((product) =>
      product?.generalInformation.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null as IEntities | null);

  const handleEditContact = (contactData: IEntities) => {
    setEditData(contactData);
    setShowForm(true);
  };

  const handleDeleteContact = async (id: string) => {
    try {
      await store.dispatch(deleteEntityById(id)).unwrap();
      toast.success(`Contacto eliminado exitosamente`);
    } catch (error) {
      toast.error('' + error);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditData(null);
  };

  return (
    <>
      <div className="flex flex-col w-full font-onest">
        <main className="flex-1 py-4 md:py-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <User size={20} />
                <CardTitle>
                  {filterType === 'supplier'
                    ? 'Proveedores'
                    : filterType === 'customer'
                      ? 'Clientes'
                      : 'Contactos'}
                </CardTitle>
              </div>
              <CardDescription>
                {filterType === 'contact'
                  ? 'Gestione todos sus contactos'
                  : `Gestione sus ${filterType}s`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <SearchComponent
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
                {access.create && (
                  <Dialog open={showForm} onOpenChange={setShowForm}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="h-8 gap-1"
                        onClick={() => {
                          setEditData(null);
                          setShowForm(true);
                        }}
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span>Agregar</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="font-onest">
                      <DialogHeader>
                        <AddContact
                          initialData={editData}
                          onClose={handleCloseForm}
                        />
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              {currentItems.length === 0 ? (
                <span className="flex justify-center w-full text-sm text-center text-muted-foreground">
                  No hay productos en esta sucursal
                </span>
              ) : (
                <TablaContacts
                  access={access}
                  handleDeleteContact={handleDeleteContact}
                  currentItems={currentItems}
                  handleEditContact={handleEditContact}
                />
              )}
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </CardFooter>
          </Card>
        </main>
      </div>
      <Toaster richColors position="bottom-right" />
    </>
  );
};
