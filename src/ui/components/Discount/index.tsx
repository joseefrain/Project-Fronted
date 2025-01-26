import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAppSelector } from '@/app/hooks';
import { getAllGroupsSlice } from '@/app/slices/groups';
import { store } from '@/app/store';
import { fetchAllProducts } from '@/app/slices/productsSlice';
import {
  cleanDataSales,
  createDiscountSales,
  deleteDiscountSales,
  //   getDiscounts,
  getDiscountsByBranch,
  getDiscountsByBranchAll,
  updateDiscountSales,
} from '@/app/slices/salesSlice';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ITablaBranch } from '@/interfaces/branchInterfaces';
import {
  IDescuentoCreate,
  IDescuentoGrupo,
  IDescuentoMapeado,
  IDescuentosProductos,
} from '@/interfaces/salesInterfaces';
import Pagination from '@/shared/components/ui/Pagination/Pagination';
import { SearchComponent } from '@/shared/components/ui/Search';
import { GetBranches } from '@/shared/helpers/Branchs';
import { getFormatedDate } from '@/shared/helpers/transferHelper';
import { useFilteredBranches } from '@/shared/hooks/useSelectedBranch';
import { Pencil, Save, Trash2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { IndexModal } from './modal';
import { ROLE } from '../../../interfaces/roleInterfaces';
import { useRoleAccess } from '../../../shared/hooks/useRoleAccess';
import { PAGES_MODULES } from '../../../shared/helpers/roleHelper';

export default function DiscountManager() {
  const access = useRoleAccess(PAGES_MODULES.DESCUENTOS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { branches, selectedBranch, setSelectedBranch } = useFilteredBranches();
  const dataAllProducts = useAppSelector((state) => state.products.products);
  const userRoles = useAppSelector((state) => state.auth.signIn.user);
  const GroupsAll = useAppSelector((state) => state.categories.groups);
  const dataFilterID = branches.filter(
    (branch) => branch._id === userRoles?.sucursalId?._id
  );
  const filteredBranche =
    userRoles?.role === ROLE.ROOT ? branches : dataFilterID;
  const dataProduct = useAppSelector(
    (state) => state.branches.selectedBranch?.products
  );
  let idBranch = userRoles?.sucursalId?._id;

  const [formState, setFormState] = useState<IDescuentoCreate>({
    nombre: '',
    tipoDescuento: 'porcentaje',
    valorDescuento: 0,
    fechaInicio: new Date(),
    fechaFin: new Date(),
    minimoCompra: { $numberDecimal: 0 },
    minimoCantidad: 0,
    activo: true,
    moneda_id: '64b7f1b4b4f1b5f1c7e7f2a9',
    codigoDescunto: '',
    deleted_at: null,
    tipoDescuentoEntidad: 'Product',
    productId: '',
    groupId: '',
    sucursalId: '',
  });
  const stateProduct = formState.tipoDescuentoEntidad === 'Product';

  const [, setSelectedGroup] = useState<{
    nombre: string;
    _id: string;
  } | null>(null);

  const [, setSelectedProduct] = useState<{
    nombre: string;
    _id: string;
  } | null>(null);

  const groupsAllOptions = GroupsAll.filter((branch) => branch._id).map(
    (branch) => ({
      id: branch._id,
      nombre: branch.nombre,
    })
  );
  const options = filteredBranche
    .filter((branch) => branch._id)
    .map((branch) => ({
      id: branch._id as string,
      nombre: branch.nombre,
    }));

  const dataFilterBranchProducts =
    userRoles?.role === ROLE.ROOT
      ? dataAllProducts
      : (dataProduct ?? ([] as ITablaBranch[]));

  const opcionesProductos = dataFilterBranchProducts.map((branch) => {
    return {
      id: branch.id!,
      nombre: branch.nombre,
    };
  });

  const handleSelectChangeBranch = (value: string) => {
    const branch = branches.find((b) => b._id === value);
    if (branch) {
      setSelectedBranch({ nombre: branch.nombre, _id: branch._id ?? '' });
    }

    setFormState((prevState) => ({
      ...prevState,
      sucursalId: branch?._id ?? '',
    }));
  };

  const handleSelectChange = (value: string) => {
    const selectedGroupId = value;
    const category = GroupsAll.find((b) => b._id === selectedGroupId);

    if (category) {
      setSelectedGroup({
        nombre: category.nombre,
        _id: category._id ?? '',
      });

      setFormState((prevState) => ({
        ...prevState,
        groupId: category._id ?? '',
      }));
    }
  };

  const handleProducts = (value: string) => {
    const selectedProduct = dataAllProducts.find((d) => d.id === value);

    if (selectedProduct) {
      setSelectedProduct({
        nombre: selectedProduct.nombre,
        _id: selectedProduct.id ?? '',
      });

      setFormState((prevState) => ({
        ...prevState,
        productId: selectedProduct.id ?? '',
      }));
    }
  };
  const fetchData = async () => {
    if (!idBranch) return;
    await GetBranches(idBranch as unknown as string);
  };

  useEffect(() => {
    fetchData();
    store.dispatch(getAllGroupsSlice()).unwrap();
    store.dispatch(getDiscountsByBranchAll(idBranch as string)).unwrap();
    store.dispatch(fetchAllProducts()).unwrap();
  }, []);

  const updateFormState = (field: keyof IDescuentoCreate, value: string) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (editingId) {
        await store.dispatch(updateDiscountSales(formState)).unwrap();
        toast.success('Descuento actualizado exitosamente');
      } else {
        await store.dispatch(createDiscountSales(formState)).unwrap();
        toast.success('Descuento creado exitosamente');
      }
      setIsModalOpen(false);
      cleanDataSales();
    } catch (error) {
      toast.error('' + error);
    }
  };

  const openEditModal = (id: string) => {
    // const discount = data.find((d) => d._id === id);
    // if (discount) {
    //   setFormState(discount);
    //   setEditingId(id);
    //   setIsModalOpen(true);
    // }
  };

  const openAddModal = () => {
    setFormState({
      nombre: '',
      tipoDescuento: 'porcentaje',
      valorDescuento: 0,
      fechaInicio: new Date(),
      fechaFin: new Date(),
      minimoCompra: { $numberDecimal: 0 },
      minimoCantidad: 0,
      activo: true,
      moneda_id: '64b7f1b4b4f1b5f1c7e7f2a9',
      codigoDescunto: '',
      deleted_at: null,
      tipoDescuentoEntidad: 'Product',
      productId: '',
      groupId: '',
      sucursalId: '',
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  //   const filteredDiscounts = Array.isArray(data)
  //     ? data.filter((discount) =>
  //         discount.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  //       )
  //     : [];

  //   const indexOfLastItem = currentPage * itemsPerPage;
  //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  //   const currentItems = filteredDiscounts.slice(
  //     indexOfFirstItem,
  //     indexOfLastItem
  //   );
  //   const paginatedData = Math.ceil(filteredDiscounts.length / itemsPerPage);

  const removeDiscount = (id: string) => {
    store.dispatch(deleteDiscountSales(id)).unwrap();
  };

  const data = useAppSelector((state) => state.sales.discounts);
  const [selectedOption, setSelectedOption] = useState<string>(
    'descuentosPorGruposEnSucursal'
  );

  const descuentosPorGruposEnSucursal = (
    data?.descuentosPorGruposEnSucursal || []
  ).map((descuento) => ({
    ...descuento,
    tipoEntidad: 'Group',
    tipoDescuento: 'Descuento por categiorías en Sucursal',
  }));

  const descuentosPorProductosEnSucursal = (
    data?.descuentosPorProductosEnSucursal || []
  ).map((descuento) => ({
    ...descuento,
    tipoEntidad: 'Product',
    tipoDescuento: 'Descuento por Productos en Sucursal',
  }));

  const descuentosPorGruposGenerales = (
    data?.descuentosPorGruposGenerales || []
  ).map((descuento) => ({
    ...descuento,
    tipoEntidad: 'Group',
    tipoDescuento: 'Descuento por categiorías Generales',
  }));

  const descuentosPorProductosGenerales = (
    data?.descuentosPorProductosGenerales || []
  ).map((descuento) => ({
    ...descuento,
    tipoEntidad: 'Product',
    tipoDescuento: 'Descuento por Productos Generales',
  }));

  const getSelectedData = () => {
    switch (selectedOption) {
      case 'descuentosPorGruposEnSucursal':
        return descuentosPorGruposEnSucursal;
      case 'descuentosPorProductosEnSucursal':
        return descuentosPorProductosEnSucursal;
      case 'descuentosPorGruposGenerales':
        return descuentosPorGruposGenerales;
      case 'descuentosPorProductosGenerales':
        return descuentosPorProductosGenerales;
      default:
        return [];
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const selectedData = getSelectedData();

  return (
    <>
      <Toaster richColors position="bottom-right" />{' '}
      <div className="flex flex-col w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-9 font-onest dark:text-white">
          Descuentos
        </h1>
        <main className="flex-1 font-onest">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap">
                <Save className="w-4 h-4 mr-2" />
                Descuentos
              </CardTitle>
              <CardDescription>
                Manage your discounts and view their sales performance.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex justify-between mb-4">
                <SearchComponent
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
                <h1>Seleccione una categoría de descuentos</h1>
                <select value={selectedOption} onChange={handleChange}>
                  <option value="descuentosPorGruposEnSucursal">
                    Descuentos por Grupos en Sucursal
                  </option>
                  <option value="descuentosPorProductosEnSucursal">
                    Descuentos por Productos en Sucursal
                  </option>
                  <option value="descuentosPorGruposGenerales">
                    Descuentos por Grupos Generales
                  </option>
                  <option value="descuentosPorProductosGenerales">
                    Descuentos por Productos Generales
                  </option>
                </select>
                {access.create && (
                  <Button onClick={openAddModal}>Agregar Descuento</Button>
                )}
              </div>
              <Table className="min-w-full divide-y divide-gray-200">
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tipo de Descuento</TableHead>
                    <TableHead>Tipo Descuento</TableHead>
                    <TableHead>Valor Descuento</TableHead>
                    <TableHead>Fecha Inicio</TableHead>
                    <TableHead>Fecha Fin</TableHead>
                    {(access.update || access.delete) && (
                      <TableHead className="text-center">Acciones</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedData.map((discount) => (
                    <TableRow key={discount.descuentoId._id}>
                      <TableCell className="px-4 py-2">
                        {discount.descuentoId.nombre}
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        {discount.tipoDescuento}
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        {discount.descuentoId.tipoDescuento}
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        {discount.descuentoId.valorDescuento}
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        {getFormatedDate(discount.descuentoId.fechaInicio)}
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        {getFormatedDate(discount.descuentoId.fechaFin)}
                      </TableCell>
                      {(access.update || access.delete) && (
                        <TableCell className="flex items-center justify-center gap-2 px-4 py-2">
                          {access.update && (
                            <Button
                              onClick={() =>
                                openEditModal(discount.descuentoId._id)
                              }
                              variant="outline"
                              size="sm"
                              className="text-blue-600"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          )}
                          {access.delete && (
                            <Button
                              onClick={() =>
                                removeDiscount(discount.descuentoId._id)
                              }
                              className="w-8 h-8"
                              variant="outline"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <IndexModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                editingId={editingId}
                updateFormState={updateFormState}
                formState={formState}
                handleSubmit={handleSubmit}
                handleSelectChange={handleSelectChange}
                handleSelectChangeBranch={handleSelectChangeBranch}
                selectedBranch={selectedBranch}
                options={options}
                groupsAllOptions={groupsAllOptions}
                stateProduct={stateProduct}
                opcionesProductos={opcionesProductos}
                userRoles={userRoles}
                handleProducts={handleProducts}
              />
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              {/* <Pagination
                currentPage={currentPage}
                totalPages={paginatedData}
                onPageChange={setCurrentPage}
              /> */}
            </CardFooter>
          </Card>
        </main>
      </div>
    </>
  );
}
