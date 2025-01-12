import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IRole, IRoleState } from '../../interfaces/roleInterfaces';
import { handleThunkError } from '../../shared/utils/errorHandlers';
import {
  deleteRole,
  fetchRoles,
  postRole,
  updateRole,
} from '../../api/services/roles';

const initialState: IRoleState = {
  roles: [],
  status: 'idle',
  error: null,
};

export const getRoles = createAsyncThunk(
  'roles/get',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchRoles();
      return response.data;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const createRole = createAsyncThunk(
  'roles/create',
  async (role: IRole, { rejectWithValue }) => {
    try {
      const response = await postRole(role);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const removeRole = createAsyncThunk(
  'roles/remove',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await deleteRole(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const updatingRole = createAsyncThunk(
  'roles/update',
  async (role: IRole, { rejectWithValue }) => {
    try {
      const response = await updateRole(role);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

const roleSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRoles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getRoles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.roles = action.payload as unknown as IRole[];
      })
      .addCase(getRoles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Error fetching roles';
      })
      .addCase(createRole.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.roles = [action.payload as unknown as IRole, ...state.roles];
      })
      .addCase(createRole.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Error creating role';
      })
      .addCase(removeRole.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeRole.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.roles = state.roles.filter(
          (role) => role._id !== action.payload._id
        );
      })
      .addCase(removeRole.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Error removing role';
      })
      .addCase(updatingRole.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updatingRole.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.roles = state.roles.map((role) =>
          role._id === action.payload._id ? action.payload : role
        );
      })
      .addCase(updatingRole.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Error updating role';
      });
  },
});

// eslint-disable-next-line no-empty-pattern
export const {} = roleSlice.actions;

export const roleReducer = roleSlice.reducer;
