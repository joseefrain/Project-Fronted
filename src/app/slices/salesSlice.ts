import {
  createDiscount,
  deleteDiscount,
  getCashier,
  getDiscountByBranchId,
  getPurchaseByBranchId,
  getSaleByBranchId,
  getTransactionReturnByBranchId,
  openCashierService,
  postPurchase,
  postSale,
  postTransactionReturn,
  updateDiscount,
} from '@/api/services/sales';
import { Branch, IStatus } from '@/interfaces/branchInterfaces';
import {
  ISale,
  IDescuentoCreate,
  IListDescuentoResponse,
  INewSale,
  ITransactionReturn,
  ITypeTransaction,
} from '@/interfaces/salesInterfaces';
import { handleThunkError } from '@/shared/utils/errorHandlers';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from './login';

export interface ICaja {
  _id: string;
  sucursalId: Branch;
  usuarioAperturaId: IUser;
  montoInicial: {
    $numberDecimal: number;
  };
  montoEsperado: {
    $numberDecimal: number;
  };
  montoFinalDeclarado?: number;
  diferencia?: number;
  fechaApertura: Date;
  fechaCierre?: Date | null;
  estado: 'abierta' | 'cerrada';
}

interface SalesState {
  caja: ICaja | null;
  sales: ISale[];
  discounts: IListDescuentoResponse | null;
  branchDiscounts: IListDescuentoResponse;
  branchSales: ISale[];
  branchPurchases: ISale[];
  status: IStatus;
  error: string | null;
  returns: ISale[];
}

const initialState: SalesState = {
  caja: null,
  sales: [],
  discounts: null,
  branchSales: [],
  branchPurchases: [],
  branchDiscounts: {} as IListDescuentoResponse,
  status: 'idle',
  error: null,
  returns: [],
};

export interface IDescuentoDeleteParams {
  id: string;
  sucursalId?: string;
  productoId?: string;
  grupoId?: string;
}

export const createDiscountSales = createAsyncThunk(
  'transactions/create',
  async (transfer: IDescuentoCreate, { rejectWithValue }) => {
    try {
      const response = await createDiscount(transfer);

      return response.data;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const deleteDiscountSales = createAsyncThunk(
  'transactions/deleteDiscount',
  async (params: IDescuentoDeleteParams, { rejectWithValue }) => {
    try {
      await deleteDiscount(params);
      return params;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const updateDiscountSales = createAsyncThunk(
  'transactions/update',
  async (transfer: IDescuentoCreate, { rejectWithValue }) => {
    try {
      const response = await updateDiscount(transfer);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const getDiscountsByBranch = createAsyncThunk(
  'transactions/getByBranchId',
  async (id: string) => {
    try {
      const response = await getDiscountByBranchId(id);
      return response.data;
    } catch (error) {
      return handleThunkError(error);
    }
  }
);

export const getDiscountsByBranchAll = createAsyncThunk(
  'transactions/getByBranchId',
  async (id: string) => {
    try {
      const response = await getDiscountByBranchId(id);
      return response.data;
    } catch (error) {
      return handleThunkError(error);
    }
  }
);

export const createSale = createAsyncThunk(
  'transactions/createSale',
  async (sale: INewSale, { rejectWithValue }) => {
    try {
      const response = await postSale(sale);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const createPurchase = createAsyncThunk(
  'transactions/createPurchase',
  async (sale: INewSale, { rejectWithValue }) => {
    try {
      const response = await postPurchase(sale);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const getSalesByBranch = createAsyncThunk(
  'transactions/getSalesByBranchId',
  async (id: string) => {
    try {
      const response = await getSaleByBranchId(id);
      return response.data;
    } catch (error) {
      return handleThunkError(error);
    }
  }
);

export const getPurchasesByBranch = createAsyncThunk(
  'transactions/getPurchasesByBranchId',
  async (id: string) => {
    try {
      const response = await getPurchaseByBranchId(id);
      return response.data;
    } catch (error) {
      return handleThunkError(error);
    }
  }
);

export const getCasherById = createAsyncThunk(
  'auth/getCashierByBranchId',
  async (id: string) => {
    try {
      const response = await getCashier(id);
      return response.data;
    } catch (error) {
      return handleThunkError(error);
    }
  }
);

export const openCashier = createAsyncThunk(
  'transactions/openCashier',
  async (payload: { sucursalId: string; userId: string }) => {
    try {
      const response = await openCashierService(
        payload.sucursalId,
        payload.userId
      );
      return response.data;
    } catch (error) {
      return handleThunkError(error);
    }
  }
);

export const createSaleReturn = createAsyncThunk(
  'transactions/return',
  async (data: ITransactionReturn, { rejectWithValue }) => {
    try {
      const response = await postTransactionReturn(data);
      return {
        ...response.data,
        type: data.tipoTransaccion,
      };
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const fetchTransactionReturnByBranchId = createAsyncThunk(
  'transactions/fetchTransactionReturnByBranchId',
  async (
    {
      id,
      type,
    }: {
      id: string;
      type: ITypeTransaction;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await getTransactionReturnByBranchId(id, type);

      console.log(response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

const salesSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setDiscounts: (state, action: PayloadAction<IListDescuentoResponse>) => {
      state.discounts = action.payload;
    },
    updateStatus: (state, action: PayloadAction<IStatus>) => {
      state.status = action.payload;
    },

    cleanDataSales: (state) => {
      state.discounts = {} as IListDescuentoResponse;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createDiscountSales.pending, (state) => {
        state.status = 'loading';
      })

      .addCase(deleteDiscountSales.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteDiscountSales.fulfilled, (state, action) => {
        state.status = 'succeeded';

        if (state.discounts) {
          const {
            descuentosPorProductosGenerales,
            descuentosPorProductosEnSucursal,
            descuentosPorGruposGenerales,
            descuentosPorGruposEnSucursal,
          } = state.discounts;

          state.discounts = {
            descuentosPorProductosGenerales:
              descuentosPorProductosGenerales.filter(
                (d) => d.descuentoId._id !== action.payload.id
              ),
            descuentosPorProductosEnSucursal:
              descuentosPorProductosEnSucursal.filter(
                (d) => d.descuentoId._id !== action.payload.id
              ),
            descuentosPorGruposGenerales: descuentosPorGruposGenerales.filter(
              (d) => d.descuentoId._id !== action.payload.id
            ),
            descuentosPorGruposEnSucursal: descuentosPorGruposEnSucursal.filter(
              (d) => d.descuentoId._id !== action.payload.id
            ),
          };
        }
      })

      .addCase(updateDiscountSales.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        updateDiscountSales.fulfilled,
        (state, action: PayloadAction<IDescuentoCreate>) => {
          state.status = 'succeeded';
          if (state.discounts) {
            const updateDiscountList = (list: any[]) =>
              list.map((d) =>
                d.descuentoId._id === action.payload._id
                  ? { ...d, descuentoId: action.payload }
                  : d
              );

            state.discounts.descuentosPorProductosGenerales =
              updateDiscountList(
                state.discounts.descuentosPorProductosGenerales
              );
            state.discounts.descuentosPorProductosEnSucursal =
              updateDiscountList(
                state.discounts.descuentosPorProductosEnSucursal
              );
            state.discounts.descuentosPorGruposGenerales = updateDiscountList(
              state.discounts.descuentosPorGruposGenerales
            );
            state.discounts.descuentosPorGruposEnSucursal = updateDiscountList(
              state.discounts.descuentosPorGruposEnSucursal
            );
          }
        }
      )
      .addCase(createSale.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.sales = [...state.sales, payload];
      })
      .addCase(getSalesByBranch.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.branchSales = payload;
      })
      .addCase(getCasherById.fulfilled, (state, { payload }) => {
        state.caja = payload;
      })
      .addCase(getPurchasesByBranch.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.branchPurchases = payload;
      })
      .addCase(getDiscountsByBranch.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getDiscountsByBranchAll.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.discounts = payload;
      })
      .addCase(
        fetchTransactionReturnByBranchId.fulfilled,
        (state, { payload }) => {
          state.status = 'succeeded';
          state.returns = payload;
        }
      )
      .addCase(createSaleReturn.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';

        if (payload.type === ITypeTransaction.VENTA) {
          const saleIndex = state.branchSales.findIndex(
            (sale) => sale.id === payload.transaccionActualizada.id
          );
          state.branchSales[saleIndex] = payload.transaccionActualizada;
          state.returns.push(payload.devolucion);
          return;
        }

        const purchaseIndex = state.branchPurchases.findIndex(
          (purchase) => purchase.id === payload.transaccionActualizada.id
        );
        state.branchPurchases[purchaseIndex] = payload.transaccionActualizada;
        state.returns.push(payload.devolucion);
      });
  },
});

export const { setDiscounts, updateStatus, cleanDataSales } =
  salesSlice.actions;

export const salesReducer = salesSlice.reducer;
