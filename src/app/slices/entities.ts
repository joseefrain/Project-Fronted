import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  createEntity,
  deleteEntity,
  getAllEntities,
  updateEntity,
} from '../../api/services/entities';
import { handleThunkError } from '../../shared/utils/errorHandlers';
import { entitiesState, IEntities } from '../../interfaces/entitiesInterfaces';

interface updateEntityByIdParams {
  entity: IEntities;
  id: string;
}

export const addEntity = createAsyncThunk(
  'entities/addEntity',
  async (entity: IEntities, { rejectWithValue }) => {
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
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteEntity(id);
      return id;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const updateEntityById = createAsyncThunk(
  'entities/update',
  async ({ entity, id }: updateEntityByIdParams, { rejectWithValue }) => {
    try {
      const response = await updateEntity(entity, id);
      return response;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

const initialState: entitiesState = {
  data: [],
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
        state.data = state.data.filter(
          (product) => product._id !== action.payload
        );
      })

      .addCase(updateEntityById.pending, (state) => {
        state.status = 'loading';
      })

      .addCase(updateEntityById.fulfilled, (state, action) => {
        state.status = 'succeeded';

        const updatedEntities = state.data.map((entity) => {
          //@ts-ignore
          if (entity._id === action.payload._id) {
            return action.payload;
          }
          return entity;
        });
        //@ts-ignore
        state.data = updatedEntities;
      });
  },
});

export const { addEntities, setSelectedEntity } = entitiesSlice.actions;
export const entitiesReducer = entitiesSlice.reducer;
