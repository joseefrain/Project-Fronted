import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

import { useAppSelector } from '@/app/hooks';
import { getAllGroupsSlice } from '@/app/slices/groups';
import { store } from '@/app/store';
import {
  cleanDataSales,
  createDiscountSales,
  deleteDiscountSales,
  getDiscountsByBranchAll,
  IDescuentoDeleteParams,
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
import {
  IDescuentoCreate,
  IDescuentoMapeado,
  IDescuentoMapeadoExtendido,
} from '@/interfaces/salesInterfaces';
import Pagination from '@/shared/components/ui/Pagination/Pagination';
import { SearchComponent } from '@/shared/components/ui/Search';
import { GetBranches } from '@/shared/helpers/Branchs';
import { useFilteredBranches } from '@/shared/hooks/useSelectedBranch';

import { toast, Toaster } from 'sonner';
import { IndexModal } from './modal';
import { ROLE } from '../../../interfaces/roleInterfaces';
import { useRoleAccess } from '../../../shared/hooks/useRoleAccess';
import { PAGES_MODULES } from '../../../shared/helpers/roleHelper';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { fetchAllProducts } from '../../../app/slices/productsSlice';
import { Save } from 'lucide-react';
import { TableIndex } from './tableIndex';

export default function DiscountManager() {
  const access = useRoleAccess(PAGES_MODULES.DESCUENTOS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const data = useAppSelector((state) => state.sales.discounts);
  const [selectedOption, setSelectedOption] = useState<string>('all');
  const { branches, selectedBranch, setSelectedBranch } = useFilteredBranches();
  const productsBYBranch = useAppSelector((state) => state.products.products);
  const dataAllProducts = useAppSelector((state) => state.products.allProducts);
  const userRoles = useAppSelector((state) => state.auth.signIn.user);
  const GroupsAll = useAppSelector((state) => state.categories.groups);
  const dataFilterID = branches.filter(
    (branch) => branch._id === userRoles?.sucursalId?._id
  );
  const filteredBranche =
    userRoles?.role === ROLE.ROOT ? branches : dataFilterID;
  let idBranch = userRoles?.sucursalId?._id;
  const now = new Date();
  const localISOTime = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000
  ).toISOString();

  const initializeFormState = (): IDescuentoCreate => ({
    nombre: '',
    tipoDescuento: 'porcentaje',
    valorDescuento: 0,
    fechaInicio: new Date(localISOTime),
    fechaFin: new Date(localISOTime),
    minimoCompra: { $numberDecimal: 0 },
    minimoCantidad: 0,
    activo: true,
    moneda_id: '64b7f1b4b4f1b5f1c7e7f2a9',
    codigoDescunto: '',
    deleted_at: null,
    tipoDescuentoEntidad: 'Group',
    productId: '',
    groupId: '',
    sucursalId: '',
    minimiType: 'compra',
  });

  const [formState, setFormState] = useState<IDescuentoCreate>(
    initializeFormState()
  );

  const stateProduct = formState.tipoDescuentoEntidad === 'Product';

  const [, setSelectedGroup] = useState<{
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

  const opcionesProductos = productsBYBranch
    .filter((product) => product.sucursalId === selectedBranch?._id)
    .map((product) => ({
      id: product.id!,
      nombre: product.nombre,
    }));

  const opcionesProductosALL = dataAllProducts?.map((product) => ({
    id: product.id!,
    nombre: product.nombre,
  }));

  const optionsAllProducts =
    !selectedBranch || selectedBranch?._id === ''
      ? opcionesProductosALL || []
      : opcionesProductos;

  const handleSelectChangeBranch = (value: string) => {
    if (value === 'Todos') {
      setSelectedBranch(null);
      setFormState((prevState) => ({
        ...prevState,
        sucursalId: '',
        productId: '',
      }));
    } else {
      const branch = branches.find((b) => b._id === value);
      if (branch) {
        setSelectedBranch({ nombre: branch.nombre, _id: branch._id ?? '' });
      }

      setFormState((prevState) => ({
        ...prevState,
        sucursalId: branch?._id ?? '',
        productId: '',
      }));
    }
  };

  const handleSelectChangeCategory = (value: string) => {
    const category = GroupsAll.find((b) => b._id === value);
    if (category) {
      setSelectedGroup({
        nombre: category.nombre,
        _id: category._id ?? '',
      });

      setFormState((prevState) => ({
        ...prevState,
        groupId: category._id ?? '',
        productId: '',
      }));
    }
  };

  const handleProducts = (value: string) => {
    updateFormState('productId', value);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!idBranch) return;

      try {
        store.dispatch(fetchAllProducts());
        await GetBranches(idBranch as unknown as string);
        store.dispatch(getAllGroupsSlice()).unwrap();
        store.dispatch(getDiscountsByBranchAll(idBranch)).unwrap();
      } catch (error: any) {
        toast.error('Error al cargar los datos' + error.message);
      }
    };

    fetchData();
  }, [idBranch]);

  const updateFormState = (field: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'tipoDescuentoEntidad' && {
        productId: value === 'Product' ? prev.productId : '',
        groupId: value === 'Group' ? prev.groupId : '',
      }),
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

  const mapWithTipo = <T extends IDescuentoMapeado>(
    items: T[],
    tipo: IDescuentoMapeadoExtendido['tipo'],
    tipoDescuento: string
  ): IDescuentoMapeadoExtendido[] =>
    items.map((item) => ({
      ...item,
      tipo,
      tipoDescuento,
    }));

  const descuentosPorGruposEnSucursal = data?.descuentosPorGruposEnSucursal
    ? mapWithTipo(
        data.descuentosPorGruposEnSucursal as IDescuentoMapeado[],
        'descuentosPorGruposEnSucursal',
        'Descuento por categorías en Sucursal'
      )
    : [];

  const descuentosPorProductosEnSucursal =
    data?.descuentosPorProductosEnSucursal
      ? mapWithTipo(
          data.descuentosPorProductosEnSucursal as IDescuentoMapeado[],
          'descuentosPorProductosEnSucursal',
          'Descuento por Productos en Sucursal'
        )
      : [];

  const descuentosPorGruposGenerales = data?.descuentosPorGruposGenerales
    ? mapWithTipo(
        data.descuentosPorGruposGenerales.map((item) => ({
          ...item,
          tipoEntidad: 'Group',
        })) as IDescuentoMapeado[],
        'descuentosPorGruposGenerales',
        'Descuento por categorías Generales'
      )
    : [];

  const descuentosPorProductosGenerales = data?.descuentosPorProductosGenerales
    ? mapWithTipo(
        data.descuentosPorProductosGenerales.map((item) => ({
          ...item,
          tipoEntidad: 'Product',
        })) as IDescuentoMapeado[],
        'descuentosPorProductosGenerales',
        'Descuento por Productos Generales'
      )
    : [];

  const allDescuentos: IDescuentoMapeadoExtendido[] = [
    ...descuentosPorGruposEnSucursal,
    ...descuentosPorProductosEnSucursal,
    ...descuentosPorGruposGenerales,
    ...descuentosPorProductosGenerales,
  ];

  const getSelectedData = () => {
    if (selectedOption === 'all') {
      return allDescuentos;
    }
    return allDescuentos.filter(
      (descuento) => descuento.tipo === selectedOption
    );
  };

  const selectedData = getSelectedData();

  const handleChange = (value: string) => {
    setSelectedOption(value);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredDiscounts = selectedData.filter((discount) =>
    discount.descuentoId.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDiscounts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const paginatedData = Math.ceil(filteredDiscounts.length / itemsPerPage);

  const openAddModal = () => {
    setFormState({
      nombre: '',
      tipoDescuento: 'porcentaje',
      valorDescuento: 0,
      fechaInicio: new Date(localISOTime),
      fechaFin: new Date(),
      //@ts-ignore
      minimoCompra: 0,
      minimoCantidad: 0,
      activo: true,
      moneda_id: '64b7f1b4b4f1b5f1c7e7f2a9',
      codigoDescunto: '',
      deleted_at: null,
      tipoDescuentoEntidad: 'Product',
      productId: '',
      groupId: '',
      sucursalId: '',
      minimiType: 'compra',
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const discountGn = currentItems.map((d) => ({
    _id: d.descuentoId._id,
    tipoEntidad: d.tipoEntidad,
    sucursalId: d.sucursalId,
    groupId: d.grupoId,
    productId: d.productId,
    minimiType: d.descuentoId.minimiType,
  }));

  const editDescuentoById = (_id: string) => {
    const discount = currentItems.find((d) => d.descuentoId._id === _id);
    if (!discount) return;
    const matchingDiscountGn = discountGn.find((d) => d._id === _id);

    const typeEntity: 'Product' | 'Group' = matchingDiscountGn?.groupId
      ? 'Group'
      : matchingDiscountGn?.productId
        ? 'Product'
        : 'Product';

    const discountCreate: IDescuentoCreate = {
      _id: discount.descuentoId._id,
      nombre: discount.descuentoId.nombre || '',
      tipoDescuento: discount.descuentoId.tipoDescuento || 'porcentaje',
      valorDescuento: discount.descuentoId.valorDescuento,
      fechaInicio: new Date(discount.descuentoId.fechaInicio),
      fechaFin: new Date(discount.descuentoId.fechaFin),
      minimoCompra: discount.descuentoId.minimoCompra || { $numberDecimal: 0 },
      minimoCantidad: discount.descuentoId.minimoCantidad,
      activo: discount.descuentoId.activo,
      moneda_id: discount.descuentoId.moneda_id,
      codigoDescunto: discount.descuentoId.codigoDescunto,
      deleted_at: discount.descuentoId.deleted_at,
      tipoDescuentoEntidad: typeEntity,
      productId: matchingDiscountGn?.productId || '',
      groupId: matchingDiscountGn?.groupId || '',
      sucursalId: matchingDiscountGn?.sucursalId || '',
      minimiType: matchingDiscountGn?.minimiType ?? 'compra',
    };
    setFormState(discountCreate);
    setEditingId(_id);
    setIsModalOpen(true);
  };

  const removeDiscount = (id: string) => {
    const matchingDiscountGn = discountGn.find((d) => d._id === id);
    const formattedData: IDescuentoDeleteParams = {
      sucursalId: matchingDiscountGn?.sucursalId || '',
      productoId: matchingDiscountGn?.productId || '',
      grupoId: matchingDiscountGn?.groupId || '',
      id,
    };
    store.dispatch(deleteDiscountSales(formattedData)).unwrap();
  };

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
              <CardDescription>Gestiona tus descuentos.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4 max-sm:flex-wrap max-sm:justify-center">
                <div className="flex items-center gap-3 place-items-baseline max-sm:flex-col max-sm:gap-0">
                  <SearchComponent
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                  <div className="flex w-full h-full ">
                    <Select
                      value={selectedOption}
                      onValueChange={(value) => handleChange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          Todos los descuentos
                        </SelectItem>
                        <SelectItem value="descuentosPorGruposEnSucursal">
                          Descuentos por Grupos en Sucursal
                        </SelectItem>
                        <SelectItem value="descuentosPorProductosEnSucursal">
                          Descuentos por Productos en Sucursal
                        </SelectItem>
                        <SelectItem value="descuentosPorGruposGenerales">
                          Descuentos por Grupos Generales
                        </SelectItem>
                        <SelectItem value="descuentosPorProductosGenerales">
                          Descuentos por Productos Generales
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {access.create && (
                  <Button
                    onClick={openAddModal}
                    className="max-sm:mt-4 max-sm:w-[200px]"
                  >
                    Agregar Descuento
                  </Button>
                )}
              </div>
              <TableIndex
                currentItems={currentItems}
                removeDiscount={removeDiscount}
                editDescuentoById={editDescuentoById}
                access={access}
              />
              <IndexModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                editingId={editingId}
                updateFormState={updateFormState}
                formState={formState}
                handleSubmit={handleSubmit}
                handleSelectChangeCategory={handleSelectChangeCategory}
                handleSelectChangeBranch={handleSelectChangeBranch}
                selectedBranch={selectedBranch}
                options={options}
                groupsAllOptions={groupsAllOptions}
                stateProduct={stateProduct}
                opcionesProductos={optionsAllProducts}
                userRoles={userRoles}
                handleProducts={handleProducts}
              />
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <Pagination
                currentPage={currentPage}
                totalPages={paginatedData}
                onPageChange={setCurrentPage}
              />
            </CardFooter>
          </Card>
        </main>
      </div>
    </>
  );
}
