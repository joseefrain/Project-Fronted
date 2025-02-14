import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  IDailyRegisterResponse,
  IGetRecordedHours,
  IRecordedHours,
  IUpdateRecordedHours,
} from '../../interfaces/workHours';
import {
  createRecordedHours,
  exitRecordedHours,
  getRecordedHours,
  updateRecordedHours,
} from '../../api/services/RecordedHours';
import { handleThunkError } from '../../shared/utils/errorHandlers';
import { IStatus } from '../../interfaces/branchInterfaces';

export const createRecordedHoursPatch = createAsyncThunk(
  'workHours/create',
  async (payload: IRecordedHours, { rejectWithValue }) => {
    try {
      const response = await createRecordedHours(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const exitRecordedHourPatch = createAsyncThunk(
  'workHours/exit',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await exitRecordedHours(id);
      return response;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const getRecordedHoursPatch = createAsyncThunk(
  'workHours/getRecordedHours',
  async (payload: IGetRecordedHours, { rejectWithValue }) => {
    try {
      const response = await getRecordedHours(payload);
      return response;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const updateRecordedHoursPatch = createAsyncThunk(
  'workHours/update',
  async (payload: IUpdateRecordedHours, { rejectWithValue }) => {
    try {
      const response = await updateRecordedHours(payload);
      return response;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

interface WorkHoursState {
  recordedHours: IDailyRegisterResponse[] | null;
  status: IStatus;
  error: string | null;
}

const initialState: WorkHoursState = {
  recordedHours: null,
  status: 'idle',
  error: null,
};

export const workHoursSlice = createSlice({
  name: 'workHours',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createRecordedHoursPatch.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createRecordedHoursPatch.fulfilled, (state, action) => {
        state.recordedHours = state.recordedHours
          ? [...state.recordedHours, action.payload]
          : [action.payload];
        state.status = 'succeeded';
      })
      .addCase(exitRecordedHourPatch.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(exitRecordedHourPatch.fulfilled, (state, action) => {
        if (state.recordedHours) {
          state.recordedHours = state.recordedHours.filter(
            //@ts-ignore
            (h) => h._id !== action.payload.id
          );
        }
        state.status = 'succeeded';
      })
      .addCase(getRecordedHoursPatch.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getRecordedHoursPatch.fulfilled, (state, action) => {
        //@ts-ignore
        state.recordedHours = action.payload;
        state.status = 'succeeded';
      });
  },
});

export const workHoursReducer = workHoursSlice.reducer;
