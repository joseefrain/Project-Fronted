import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getCoins } from '../../api/services/coins';
import { handleThunkError } from '../../shared/utils/errorHandlers';
import { IStatus } from '../../interfaces/branchInterfaces';

export interface ICoins {
  _id: string;
  nombre: string;
  simbolo: string;
}

export const coinsSliceGet = createAsyncThunk(
  'coins/getCoins',
  async (_: void, { rejectWithValue }) => {
    try {
      const response = await getCoins();
      return response.data;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export interface ICoinsState {
  coins: ICoins[] | null;
  selectedCoin: ICoins | null;
  status: IStatus;
  error: string | null;
}

const initialState: ICoinsState = {
  coins: null,
  selectedCoin: null,
  status: 'idle',
  error: null,
};

export const coinsSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {
    setSelectedCoin: (state, action: PayloadAction<ICoins>) => {
      state.selectedCoin = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(coinsSliceGet.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(coinsSliceGet.fulfilled, (state, action) => {
        state.coins = action.payload;
        state.status = 'succeeded';
      })
      .addCase(coinsSliceGet.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = 'failed';
      });
  },
});

export const { setSelectedCoin } = coinsSlice.actions;
export const coinsReducer = coinsSlice.reducer;
