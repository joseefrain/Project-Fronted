import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Iauth, registerUsers } from '../../api/services/auth';
import { handleThunkError } from '../../shared/utils/errorHandlers';
import { Branch } from '../../interfaces/branchInterfaces';
import { IRole, ROLE } from '../../interfaces/roleInterfaces';
import { ICajaBrach } from './cashRegisterSlice';

export type IRoles = 'admin' | 'user' | 'root';

export interface IUser {
  _id: string;
  username: string;
  role: ROLE;
  password: string;
  sucursalId?: Branch;
  roles: IRole[];
}

export interface IToken {
  token: string;
  user?: IUser;
  cajaId?: string;
}

export const saveToLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeFromLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};

const getFromLocalStorage = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

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
    role: ROLE;
    sucursalId?: Branch;
    isRootUser?: boolean;
    roles: IRole[];
  };
  status: statusLoguer;
  cajaId?: string | ICajaBrach;
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
  isOpen: boolean;
}

const initialState: ILoginSlice = {
  signIn: initialStateLogin,
  signUp: {
    username: '',
    password: '',
    role: ROLE.EMPLEADO,
  },
  status: 'idle',
  error: '',
  isOpen: false,
};

export const LoginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    updateUserCashier: (state, action) => {
      state.signIn.cajaId = action.payload;
    },
    updateBranchUser: (state, action: PayloadAction<Branch>) => {
      if (state.signIn.user) {
        state.signIn.user = {
          _id: state.signIn.user._id,
          username: state.signIn.user.username,
          role: state.signIn.user.role,
          sucursalId: action.payload,
          roles: state.signIn.user.roles,
        };
      }
    },
    updateSignIn: (state, action: PayloadAction<IToken>) => {
      state.signIn = {
        token: action.payload.token,
        user: {
          _id: action.payload.user!._id,
          username: action.payload.user!.username,
          role: action.payload.user!.role,
          sucursalId: action.payload.user!.sucursalId,
          roles: action.payload.user!.roles,
        },
        cajaId: action.payload.cajaId,
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
        cajaId: undefined,
        status: 'unauthenticated',
      };
      removeFromLocalStorage('user');
      removeFromLocalStorage('selectedBranch');
    },
    errorLogin: (state, { payload }: PayloadAction<string>) => {
      state.error = payload;
    },
    openDrawer: (state) => {
      state.isOpen = true;
    },
    closeDrawer: (state) => {
      state.isOpen = false;
    },

    updateRoleAssigned: (state, action: PayloadAction<IRole>) => {
      if (state.signIn.user) {
        const roles = state.signIn.user.roles.map((role) => {
          if (role._id === action.payload._id) {
            return action.payload;
          }
          return role;
        });

        state.signIn.user = {
          ...state.signIn.user,
          roles: roles,
        };

        saveToLocalStorage('user', state.signIn);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(InicioSesion.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(InicioSesion.fulfilled, (state, { payload }) => {
      state.signIn = {
        cajaId: payload.cajaId,
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

export const {
  updateSignIn,
  updateSignUp,
  logout,
  openDrawer,
  closeDrawer,
  updateUserCashier,
  updateBranchUser,
  updateRoleAssigned,
} = LoginSlice.actions;
export const loginReducer = LoginSlice.reducer;
