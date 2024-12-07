import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { handleThunkError } from '../../shared/utils/errorHandlers';
import {
  ICredit,
  ICreditsState,
  IPostPagoCredito,
} from '../../interfaces/creditsInterfaces';
import {
  fetchCreditById,
  fetchCreditsByBranch,
  postPayCredit,
} from '../../api/services/credits';

export const getCreditsByBranch = createAsyncThunk(
  'credits/getByBranch',
  async (id: string) => {
    try {
      const response = await fetchCreditsByBranch(id);
      return response;
    } catch (error) {
      return handleThunkError(error);
    }
  }
);

export const getCreditById = createAsyncThunk(
  'credits/getById',
  async (id: string) => {
    try {
      const response = await fetchCreditById(id);
      return response;
    } catch (error) {
      return handleThunkError(error);
    }
  }
);

export const payCredit = createAsyncThunk(
  'credits/payCredit',
  async (data: IPostPagoCredito) => {
    try {
      const response = await postPayCredit(data);
      return response;
    } catch (error) {
      return handleThunkError(error);
    }
  }
);

const initialState: ICreditsState = {
  creditSelected: null,
  credits: [],
  status: 'idle',
  error: null,
};

const creditsSlice = createSlice({
  name: 'credits',
  initialState,
  reducers: {
    setSelectedCredit: (state, action: PayloadAction<ICredit | null>) => {
      state.creditSelected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCreditsByBranch.pending, (state) => {
        state.status = 'loading';
      })

      .addCase(getCreditsByBranch.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.credits = payload;
      })

      .addCase(payCredit.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.creditSelected = payload;
      })

      .addCase(getCreditById.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.creditSelected = payload;
      });
  },
});

export const { setSelectedCredit } = creditsSlice.actions;
export const creditsReducer = creditsSlice.reducer;
