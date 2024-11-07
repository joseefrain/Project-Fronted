import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createUsers, Iauth, registerUsers } from '../../api/services/auth';
import { handleThunkError } from '../../shared/utils/errorHandlers';
import { IBranch } from '@/interfaces/branchInterfaces';

export type IRoles = 'admin' | 'user' | 'root';

export interface IUser {
  _id: string;
  username: string;
  role: IRoles;
  password: string;
  sucursalId?: IBranch;
}

export interface IToken {
  token: string;
  user?: IUser;
}

const saveToLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const removeFromLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};

const getFromLocalStorage = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const RegistroUsuario = createAsyncThunk(
  'login/create',
  async (data: Iauth, { rejectWithValue }) => {
    try {
      const response = await createUsers(data);
      return response as unknown as IToken;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const InicioSesion = createAsyncThunk(
  'auth/registerUser',
  async (
    { userCredentials }: { userCredentials: Iauth },
    { rejectWithValue }
  ) => {
    try {
      const response = await registerUsers(userCredentials);
      return response.data as IToken;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export type statusProgressLogin = 'idle' | 'loading' | 'succeeded' | 'failed';
export type statusLoguer =
  | 'authenticated'
  | 'unauthenticated'
  | 'loading'
  | 'error'
  | 'idle';

export interface IAuthSlice {
  token?: string;
  user?: {
    _id: string;
    username: string;
    role: IRoles;
    sucursalId?: IBranch;
  };
  status: statusLoguer;
}

const initialStateLogin: IAuthSlice = getFromLocalStorage('user') || {
  token: '',
  user: undefined,
  status: 'unauthenticated',
};

export interface ILoginSlice {
  signIn: IAuthSlice;
  signUp: Iauth;
  status: statusProgressLogin;
  error?: string;
}

const initialState: ILoginSlice = {
  signIn: initialStateLogin,
  signUp: {
    username: '',
    password: '',
    role: 'user',
  },
  status: 'idle',
  error: '',
};

export const LoginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    updateSignIn: (state, action: PayloadAction<IToken>) => {
      state.signIn = {
        token: action.payload.token,
        user: action.payload.user,
        status: 'authenticated',
      };
      saveToLocalStorage('user', state.signIn);
    },
    updateSignUp: (state, action: PayloadAction<Iauth>) => {
      state.signUp = action.payload;
    },
    logout: (state) => {
      state.signIn = {
        token: '',
        user: undefined,
        status: 'unauthenticated',
      };
      removeFromLocalStorage('user');
    },
    errorLogin: (state, { payload }: PayloadAction<string>) => {
      state.error = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(InicioSesion.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(InicioSesion.fulfilled, (state, { payload }) => {
      state.signIn = {
        token: payload.token,
        user: payload.user,
        status: 'authenticated',
      };
      saveToLocalStorage('user', state.signIn);
      state.status = 'succeeded';
    });
    builder.addCase(InicioSesion.rejected, (state, { payload }) => {
      state.error = payload as string;
      state.status = 'failed';
    });
  },
});

export const { updateSignIn, updateSignUp, logout } = LoginSlice.actions;
export const loginReducer = LoginSlice.reducer;
