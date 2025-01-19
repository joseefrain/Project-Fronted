import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Branch, IStatus } from '../../interfaces/branchInterfaces';
import { handleThunkError } from '../../shared/utils/errorHandlers';
import {
  closeCashier,
  craeteBox,
  getboxBranch,
  getboxId,
  openCashier,
} from '../../api/services/box';
import { IUser } from './login';

export type StateCashRegister = 'ABIERTA' | 'CERRADA';

export interface ICajaHistorico {
  fechaApertura: Date;
  fechaCierre: Date;
  montoInicial: { $numberDecimal: number };
  montoFinalDeclarado: string; // Representación de Decimal128 como string
  diferencia: string; // Representación de Decimal128 como string
  montoEsperado: { $numberDecimal: number };
  usuarioAperturaId: string | IUser; // ObjectId como string o IUser
}

export interface ICajaBrach {
  sucursalId: string | Branch; // ObjectId como string o ISucursal
  usuarioAperturaId: string | IUser | null; // ObjectId como string o IUser
  montoInicial: { $numberDecimal: number };
  montoEsperado: { $numberDecimal: number };
  montoFinalDeclarado?: { $numberDecimal: number };
  diferencia?: { $numberDecimal: number };
  fechaApertura: Date | null;
  fechaCierre?: Date | null;
  estado: StateCashRegister;
  hasMovementCashier: boolean;
  historico: ICajaHistorico[];
  consecutivo: number;
  _id: string;
}

export interface IOpenCash {
  usuarioAperturaId: string;
  montoInicial: number;
  cajaId: string;
}

export interface ICloseCash {
  cajaId: string;
  montoFinalDeclarado: string;
  usuarioArqueoId: string;
  closeWithoutCounting: boolean;
}

export interface ICreataCashRegister {
  _id?: string;
  sucursalId: string;
  usuarioAperturaId: string;
  montoInicial: number;
  consecutivo?: number;
}

export interface IBox {
  BoxesData: ICajaBrach[] | null;
  create: ICreataCashRegister | null;
  boxState: ICajaBrach[] | null;
  status: IStatus;
  error: string | null;
}

const initialState: IBox = {
  BoxesData: null,
  create: null,
  boxState: [],
  status: 'idle',
  error: null,
};

export const createBox = createAsyncThunk(
  'box/create',
  async (payload: ICreataCashRegister, { rejectWithValue }) => {
    try {
      const response = await craeteBox(payload);
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const getboxesbyBranch = createAsyncThunk(
  'box/getAllByBranch',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getboxBranch(id);
      return response;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const openBoxes = createAsyncThunk(
  'box/open',
  async (payload: IOpenCash, { rejectWithValue }) => {
    try {
      const response = await openCashier(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const closeBoxes = createAsyncThunk(
  'box/close',
  async (payload: ICloseCash, { rejectWithValue }) => {
    try {
      const response = await closeCashier(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const getBoxById = createAsyncThunk(
  'box/getById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getboxId(id);
      return response;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const boxSlice = createSlice({
  name: 'Boxes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBox.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createBox.fulfilled, (state, action) => {
        state.BoxesData = [...state.BoxesData!, action.payload];

        state.status = 'succeeded';
      })

      .addCase(createBox.rejected, (state, action) => {
        state.error = action.error.message as string;
        state.status = 'failed';
      })

      .addCase(getboxesbyBranch.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getboxesbyBranch.fulfilled, (state, action) => {
        state.BoxesData = action.payload as unknown as ICajaBrach[];
        state.status = 'succeeded';
      })
      .addCase(getboxesbyBranch.rejected, (state, action) => {
        state.error = action.error.message as string;
        state.status = 'failed';
      })

      .addCase(openBoxes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(openBoxes.fulfilled, (state, action) => {
        const openedBox = action.payload;

        state.boxState = [
          ...state.boxState!.filter((box) => box?._id !== openedBox._id),
          openedBox,
        ];

        state.BoxesData = state.BoxesData!.map((box) => {
          if (box._id === openedBox._id) {
            return openedBox;
          }
          return box;
        });

        state.status = 'succeeded';
      })
      .addCase(openBoxes.rejected, (state, action) => {
        state.error = action.error.message as string;
        state.status = 'failed';
      })

      .addCase(closeBoxes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(closeBoxes.fulfilled, (state, action) => {
        const closedBoxId = action.payload._id;

        state.BoxesData = state.BoxesData!.map((box) => {
          if (box._id === closedBoxId) {
            return action.payload;
          }
          return box;
        });
        state.status = 'succeeded';
      })

      .addCase(getBoxById.pending, (state) => {
        state.status = 'loading';
      })

      .addCase(getBoxById.fulfilled, (state, action) => {
        state.boxState = [
          ...state.boxState!,
          action.payload as unknown as ICajaBrach,
        ];
        state.status = 'succeeded';
      })
      .addCase(getBoxById.rejected, (state, action) => {
        state.error = action.error.message as string;
        state.status = 'failed';
      });
  },
});

export const {} = boxSlice.actions;
export const boxReducer = boxSlice.reducer;
