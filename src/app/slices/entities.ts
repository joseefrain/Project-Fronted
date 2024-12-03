import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createEntity, getAllEntities } from '../../api/services/entities';
import { handleThunkError } from '../../shared/utils/errorHandlers';
import { entitiesState, IEntities } from '../../interfaces/entitiesInterfaces';

export const addEntity = createAsyncThunk(
  'entities/addEntity',
  async (entity: any, { rejectWithValue }) => {
    try {
      const response = await createEntity(entity);
      console.log(response, 'response');
      return response.data;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const getEntities = createAsyncThunk('entities/getAll', async () => {
  try {
    const response = await getAllEntities();
    return response as unknown as IEntities[];
  } catch (error) {
    return handleThunkError(error);
  }
});

const initialState: entitiesState = {
  data: [] as IEntities[],
  selectedEntity: null,
  status: 'idle',
  error: null,
  loading: false,
};

const entitiesSlice = createSlice({
  name: 'entities',
  initialState,
  reducers: {
    addEntities: (state, action: PayloadAction<any>) => {
      state.data.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEntities.pending, (state) => {
        state.status = 'loading';
      })

      .addCase(getEntities.fulfilled, (state, { payload }) => {
        if (Array.isArray(payload)) {
          state.data = payload;
          state.status = 'succeeded';
        }
      });
  },
});

export const { addEntities } = entitiesSlice.actions;
export const entitiesReducer = entitiesSlice.reducer;
