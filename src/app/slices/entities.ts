import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  createEntity,
  deleteEntity,
  getAllEntities,
} from '../../api/services/entities';
import { handleThunkError } from '../../shared/utils/errorHandlers';
import { entitiesState, IEntities } from '../../interfaces/entitiesInterfaces';

export const addEntity = createAsyncThunk(
  'entities/addEntity',
  async (entity: any, { rejectWithValue }) => {
    try {
      const response = await createEntity(entity);
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

export const deleteEntityById = createAsyncThunk(
  'entities/delete',
  async (id: string) => {
    try {
      const response = await deleteEntity(id);
      return response as unknown as IEntities;
    } catch (error) {
      return handleThunkError(error);
    }
  }
);

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

    setSelectedEntity: (state, action: PayloadAction<IEntities | null>) => {
      state.selectedEntity = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        addEntity.fulfilled,
        (state, action: PayloadAction<IEntities>) => {
          state.status = 'succeeded';
          state.data.push(action.payload);
        }
      )
      .addCase(getEntities.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getEntities.fulfilled, (state, { payload }) => {
        if (Array.isArray(payload)) {
          state.data = payload;
          state.status = 'succeeded';
        }
      })
      .addCase(deleteEntityById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteEntityById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log(state.data, 'state.data');
        state.data = state.data.filter(
          (branch) => branch._id !== action.meta.arg
        );
      });
  },
});

export const { addEntities, setSelectedEntity } = entitiesSlice.actions;
export const entitiesReducer = entitiesSlice.reducer;
