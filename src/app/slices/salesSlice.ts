import {
  createDiscount,
  getAllDiscounts,
  getDiscountByBranchId,
  getSaleByBranchId,
  postSale,
} from '@/api/services/sales';
import { IStatus } from '@/interfaces/branchInterfaces';
import {
  ISale,
  IDescuentoCreate,
  IListDescuentoResponse,
} from '@/interfaces/salesInterfaces';
import { handleThunkError } from '@/shared/utils/errorHandlers';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SalesState {
  sales: ISale[];
  discounts: IDescuentoCreate[];
  branchDiscounts: IListDescuentoResponse;
  branchSales: ISale[];
  status: IStatus;
  error: string | null;
}

const initialState: SalesState = {
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
      });
  },
});

export const { setDiscounts, updateStatus, cleanDataSales } =
  salesSlice.actions;

export const salesReducer = salesSlice.reducer;
