import { IProducto } from './transferInterfaces';

export interface IProductoGroups {
  _id?: string;
  nombre: string;
  descripcion?: string;
  products?: IProducto[];
}

export interface Branch {
  _id?: string;
  pais: string;
  ciudad: string;
  nombre: string;
  telefono: string;
  direccion: string;
  description: string;
}

export interface IBranchWithProducts extends Branch {
  products: ITablaBranch[];
}

export interface BranchState {
  data: Branch[];
  selectedBranch: IBranchWithProducts | null;
  status: IStatus;
  error: string | null;
  loading: boolean;
}

export interface ICategoriesProps {
  onEdit: (isEdit: boolean) => void;
  categoriesData: IProductoGroups;
  handleSelectCategory: (cat: IProductoGroups) => void;
}

export interface IBranchProps {
  onEdit: (branch: Branch) => void;
  branch: Branch;
  handleSelectBranch: (branch: Branch) => void;
}

export type IStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface ITablaBranchSlice {
  status: IStatus;
  error: string | null;
  tablaBranches: ITablaBranch[];
}

export interface IProduct {
  createdAt: string;
  descripcion: string;
  monedaId: string;
  nombre: string;
  precio: { $numberDecimal: string };
  updatedAt: string;
  _id?: number;
}
export interface ITablaBranch {
  id?: string;
  nombre: string;
  descripcion: string;
  precio: { $numberDecimal: number };
  monedaId?: string;
  grupoId?: string;
  stock: number;
  sucursalId: string;
  inventarioSucursalId?: string;
  barCode: string;
  nombreSucursal?: string;
  grupoNombre?: string;
  ultimo_movimiento?: string;
  puntoReCompra?: number;
}

export interface IProductosGrupos {
  productoId: string;
  groupId: IProductoGroups;
}
