import {
  createDiscount,
  deleteDiscount,
  getCashier,
  getDiscountByBranchId,
  getPurchaseByBranchId,
  getSaleByBranchId,
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
  'transactions/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await deleteDiscount(id);
      return response.data;
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

      .addCase(updateDiscountSales.pending, (state) => {
        state.status = 'loading';
      })
      //   .addCase(updateDiscountSales.fulfilled, (state, { payload }) => {
      //     state.status = 'succeeded';
      //     state.discounts = state.discounts.map((discount) =>
      //       discount._id === payload._id ? payload : discount
      //     );
      //   })

      //   .addCase(getDiscounts.pending, (state) => {
      //     state.status = 'loading';
      //   })
      //   .addCase(getDiscounts.fulfilled, (state, { payload }) => {
      //     state.status = 'succeeded';
      //     state.discounts = payload as IDescuentoCreate[];
      //   })
      //   .addCase(getDiscountsByBranch.fulfilled, (state, { payload }) => {
      //     state.status = 'succeeded';
      //     state.branchDiscounts = payload;
      //   })
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
      .addCase(createSaleReturn.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.returns = [...state.returns, payload.devolucion];
      });
  },
});

export const { setDiscounts, updateStatus, cleanDataSales } =
  salesSlice.actions;

export const salesReducer = salesSlice.reducer;
