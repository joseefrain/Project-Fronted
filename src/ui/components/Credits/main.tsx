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
import { User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Pagination from '../../../shared/components/ui/Pagination/Pagination';
import { TablaCredits } from './table';
import { getCreditsByBranch } from '../../../app/slices/credits';
import { getSelectedBranchFromLocalStorage } from '../../../shared/helpers/branchHelpers';
import { ICredit } from '../../../interfaces/creditsInterfaces';

interface MainContactsProps {
  filterType: string;
}

export const MainCredits = ({ filterType }: MainContactsProps) => {
  const user = useAppSelector((state) => state.auth.signIn.user);
  const branchStoraged = getSelectedBranchFromLocalStorage();

  const Credits = useAppSelector((state) => state.credits.credits);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredProducts = Credits.filter((credit) =>
    filterType === 'historial'
      ? true
      : credit.modalidadCredito === filterType.toUpperCase()
  ).filter(
    (product) =>
      product?.entidadId.generalInformation.name ??
      ''.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleEditCredit = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    contactData: ICredit
  ) => {
    e.stopPropagation();
    console.log(contactData);
  };

  useEffect(() => {
    const branchId = !user?.sucursalId
      ? (branchStoraged ?? '')
      : (user?.sucursalId._id ?? '');

    store.dispatch(getCreditsByBranch(branchId)).unwrap();
  }, [branchStoraged, user?.sucursalId]);

  return (
    <div className="flex flex-col w-full font-onest">
      <main className="flex-1 py-4 md:py-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <User size={20} />
              <CardTitle>
                {filterType === 'historial'
                  ? 'Historial de créditos'
                  : filterType === 'pagos'
                    ? 'Créditos a pagos'
                    : 'Créditos a plazos'}
              </CardTitle>
            </div>
            <CardDescription>
              {filterType === 'historial'
                ? 'Visualización de los créditos finalizados'
                : `Gestione sus a ${filterType}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <SearchComponent
                searchTerm={searchTerm}
                placeholder="Buscar créditos..."
                setSearchTerm={setSearchTerm}
              />
            </div>

            {currentItems.length === 0 ? (
              <span className="flex justify-center w-full text-sm text-center text-muted-foreground">
                No hay créditos en esta sucursal
              </span>
            ) : (
              <TablaCredits
                currentItems={currentItems}
                handleEditCredit={handleEditCredit}
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
  );
};
