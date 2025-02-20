import { useEffect, useState } from 'react';
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
import { WalletCards } from 'lucide-react';
import Pagination from '../../../shared/components/ui/Pagination/Pagination';
import { TablaCredits } from './table';
import { getCreditsByBranch } from '../../../app/slices/credits';
import { getSelectedBranchFromLocalStorage } from '../../../shared/helpers/branchHelpers';
import { ITransacionCredit } from '../../../interfaces/creditsInterfaces';
import { getFormatedDate } from '../../../shared/helpers/transferHelper';
import { ExportToExcel } from '../../../shared/components/ui/ExportToExcel/ExportToExcel';
import { formatNumber } from '../../../shared/helpers/Branchs';
import { PAGES_MODULES } from '../../../shared/helpers/roleHelper';
import { useRoleAccess } from '../../../shared/hooks/useRoleAccess';

interface MainContactsProps {
  filterType: string;
}

export const MainCredits = ({ filterType }: MainContactsProps) => {
  const user = useAppSelector((state) => state.auth.signIn.user);
  const access = useRoleAccess(PAGES_MODULES.CONTACTOS);
  const branchStoraged = getSelectedBranchFromLocalStorage();
  const Credits = useAppSelector((state) => state.credits.credits);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredProducts = Credits.filter((credit) =>
    filterType === 'historial'
      ? credit.credito.estadoCredito === 'CERRADO'
      : filterType === 'all'
        ? credit.credito.estadoCredito === 'ABIERTO'
        : credit.credito.modalidadCredito === filterType.toUpperCase() &&
          credit.credito.estadoCredito === 'ABIERTO'
  ).filter((product) =>
    product.credito?.entidadId.generalInformation.name
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

  useEffect(() => {
    const branchId = !user?.sucursalId
      ? (branchStoraged ?? '')
      : (user?.sucursalId._id ?? '');

    store.dispatch(getCreditsByBranch(branchId)).unwrap();
  }, [branchStoraged, user?.sucursalId]);

  const columns: { key: string; label: string }[] = [
    { key: 'usuario', label: 'Usuario de alta' },
    {
      key: 'entities',
      label: 'Tipo de cliente',
    },
    { key: 'entidadName', label: 'cliente' },
    { key: 'modalidad', label: 'Modalidad' },
    { key: 'estado', label: 'Estado' },
    { key: 'estadoTrasaccion', label: 'Estado de transacción' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'saldoPendiente', label: 'Saldo Pendiente' },
    { key: 'saldoCredito', label: 'Saldo Crédito' },
    { key: 'ventacompra', label: 'Venta/Compra' },
  ];

  const formattedProducts = Credits?.map((product: ITransacionCredit) => ({
    entidadName: product.credito?.entidadId?.generalInformation?.name,
    entities: product.credito?.entidadId?.entities,
    modalidad: product.credito?.modalidadCredito,
    estado: product.credito?.estadoCredito,
    //@ts-ignore
    estadoTrasaccion: product.credito?.transaccionId?.estadoTrasaccion,
    //@ts-ignore
    fecha: getFormatedDate(product.credito?.transaccionId.fechaRegistro),
    saldoPendiente: product.credito?.saldoPendiente.$numberDecimal ?? 0,
    saldoCredito: product.credito?.saldoCredito.$numberDecimal ?? 0,
    usuario: product.credito?.transaccionId?.usuarioId.username,
    ventacompra: product.credito?.transaccionId?.tipoTransaccion,
  }));
  console.log(formattedProducts);

  const totalCosto = Credits?.reduce((acc, product) => {
    return acc + Number(product.credito?.saldoCredito.$numberDecimal ?? 0);
  }, 0);

  const dateToday = new Date();
  const fileName = ` ${getFormatedDate(dateToday)}-Registros de créditos.xlsx`;

  return (
    <div className="flex flex-col w-full font-onest">
      <main className="flex-1 py-4 md:py-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <WalletCards size={20} />
              <CardTitle>
                {filterType === 'historial'
                  ? 'Historial de créditos'
                  : filterType === 'all'
                    ? 'Créditos'
                    : filterType === 'pago'
                      ? 'Créditos a pagos'
                      : 'Créditos a plazos'}
              </CardTitle>
            </div>
            <CardDescription>
              {filterType === 'historial'
                ? 'Visualización de los créditos finalizados'
                : filterType === 'all'
                  ? 'Gestione sus créditos'
                  : `Gestione sus créditos a ${filterType}s`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <SearchComponent
                searchTerm={searchTerm}
                placeholder="Buscar créditos..."
                setSearchTerm={setSearchTerm}
              />
              {(access.update || access.delete) && (
                <ExportToExcel
                  data={formattedProducts}
                  columns={columns}
                  filename={fileName}
                  totalRow={{
                    label: 'Total de Saldo Crédito',
                    value: formatNumber(totalCosto),
                  }}
                />
              )}
            </div>

            {currentItems.length === 0 ? (
              <span className="flex justify-center w-full text-sm text-center text-muted-foreground">
                {`No hay créditos ${filterType === 'all' ? '' : filterType === 'historial' ? 'finalizados' : filterType === 'plazo' ? 'a plazos' : 'a pagos'} en esta sucursal`}
              </span>
            ) : (
              <TablaCredits
                currentItems={currentItems}
                filterType={filterType}
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
