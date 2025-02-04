import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { handleThunkError } from '../../shared/utils/errorHandlers';
import {
  getDashboardProducts,
  IGetDashboardProducts,
} from '../../api/services/dasboard';
import { IResponseGetProductMetrics } from '../../interfaces/dashboardInterface';
import { statusProgressLogin } from './login';

export const getchartsProducts = createAsyncThunk(
  'dashboard/getProducts',
  async (
    { id, fechaInicio, fechaFin }: IGetDashboardProducts,
    { rejectWithValue }
  ) => {
    try {
      const response = await getDashboardProducts({
        id,
        fechaInicio,
        fechaFin,
      });
      return response;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

interface DashboardState {
  data: IResponseGetProductMetrics | null;
  loading: boolean;
  status: statusProgressLogin;
  error: string;
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: '',
  status: 'idle',
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getchartsProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getchartsProducts.fulfilled, (state, action) => {
        state.data = action.payload as unknown as IResponseGetProductMetrics;
        state.status = 'succeeded';
      })
      .addCase(getchartsProducts.rejected, (state, action) => {
        state.error = action.error.message as string;
        state.status = 'failed';
      });
  },
});

// eslint-disable-next-line no-empty-pattern
export const {} = dashboardSlice.actions;

export const dashboardReducer = dashboardSlice.reducer;
