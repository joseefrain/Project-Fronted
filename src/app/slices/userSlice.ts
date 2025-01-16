import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { handleThunkError } from '../../shared/utils/errorHandlers';
import { deleteUser, fetchUsers } from '../../api/services/users';
import { IUserSlice } from '../../interfaces/userInterfaces';
import { IUser } from './login';
import { createUsers, Iauth, updateUser } from '../../api/services/auth';

const initialState: IUserSlice = {
  users: [],
  status: 'idle',
  error: null,
};

export const getUsers = createAsyncThunk(
  'users/get',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchUsers();
      return response.data;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const deletingUser = createAsyncThunk(
  'users/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteUser(id);
      return {
        _id: id,
      };
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const updatingUser = createAsyncThunk(
  'users/update',
  async (
    { user, id, token }: { user: Iauth; id: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateUser(id, user, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const createUser = createAsyncThunk(
  'users/create',
  async (data: Iauth, { rejectWithValue }) => {
    try {
      const response = await createUsers(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload as unknown as IUser[];
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Error fetching users';
      })
      .addCase(deletingUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deletingUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = state.users.filter(
          (user) => user._id !== action.payload._id
        );
      })
      .addCase(deletingUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Error deleting user';
      })
      .addCase(updatingUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updatingUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log(action.payload);

        state.users = state.users.map((user) => {
          if (user._id === action.payload._id) {
            return action.payload;
          }
          return user;
        });
      })
      .addCase(updatingUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Error updating user';
      })
      .addCase(createUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = [action.payload, ...state.users];
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Error creating user';
      });
  },
});

// eslint-disable-next-line no-empty-pattern
export const {} = userSlice.actions;

export const userReducer = userSlice.reducer;
