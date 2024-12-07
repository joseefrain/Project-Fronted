import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { handleThunkError } from '../../shared/utils/errorHandlers';
import { ICreditsState } from '../../interfaces/creditsInterfaces';
import { fetchCreditsByBranch } from '../../api/services/credits';

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

const initialState: ICreditsState = {
  credits: [],
  status: 'idle',
  error: null,
};

const creditsSlice = createSlice({
  name: 'credits',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCreditsByBranch.pending, (state) => {
        state.status = 'loading';
      })

      .addCase(getCreditsByBranch.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.credits = payload;
      });
  },
});

// eslint-disable-next-line no-empty-pattern
export const {} = creditsSlice.actions;
export const creditsReducer = creditsSlice.reducer;
