import {
  createDiscount,
  getAllDiscounts,
  getCashier,
  getDiscountByBranchId,
  getSaleByBranchId,
  postSale,
} from '@/api/services/sales';
import { Branch, IStatus } from '@/interfaces/branchInterfaces';
import {
  ISale,
  IDescuentoCreate,
  IListDescuentoResponse,
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
  discounts: IDescuentoCreate[];
  branchDiscounts: IListDescuentoResponse;
  branchSales: ISale[];
  status: IStatus;
  error: string | null;
}

const initialState: SalesState = {
  caja: null,
  sales: [],
  discounts: [],
  branchSales: [],
  branchDiscounts: {} as IListDescuentoResponse,
  status: 'idle',
  error: null,
};

export const createDiscountSales = createAsyncThunk(
  'sales/create',
  async (transfer: IDescuentoCreate, { rejectWithValue }) => {
    try {
      const response = await createDiscount(transfer);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

//GET
export const getDiscounts = createAsyncThunk('sales/get', async () => {
  try {
    const response = await getAllDiscounts();
    return response.data;
  } catch (error) {
    return handleThunkError(error);
  }
});

export const getDiscountsByBranch = createAsyncThunk(
  'sales/getByBranchId',
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
  'sales/createSale',
  async (sale: ISale, { rejectWithValue }) => {
    try {
      const response = await postSale(sale);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const getSalesByBranch = createAsyncThunk(
  'sales/getSalesByBranchId',
  async (id: string) => {
    try {
      const response = await getSaleByBranchId(id);
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

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    setDiscounts: (state, action: PayloadAction<IDescuentoCreate[]>) => {
      state.discounts = action.payload;
    },
    updateStatus: (state, action: PayloadAction<IStatus>) => {
      state.status = action.payload;
    },

    cleanDataSales: (state) => {
      state.discounts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createDiscountSales.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createDiscountSales.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.discounts = [...state.discounts, payload as IDescuentoCreate];
      })
      .addCase(getDiscounts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getDiscounts.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.discounts = payload as IDescuentoCreate[];
      })
      .addCase(getDiscountsByBranch.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.branchDiscounts = payload;
      })
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
      });
  },
});

export const { setDiscounts, updateStatus, cleanDataSales } =
  salesSlice.actions;

export const salesReducer = salesSlice.reducer;
