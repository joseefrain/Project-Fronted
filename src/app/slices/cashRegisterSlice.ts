import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Branch, IStatus } from '../../interfaces/branchInterfaces';
import { handleThunkError } from '../../shared/utils/errorHandlers';
import {
  closeCashier,
  craeteBox,
  getboxBranch,
  getboxId,
  getHistoryCashier,
  getUserAndBranch,
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
  hasMovementCashier?: boolean;
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

interface ITotal {
  $numberDecimal: string;
}

export interface IHistoryCashier {
  _id: string;
  sucursalId: Branch;
  cajaId: string;
  fecha: string;
  totalVentas: ITotal;
  totalCompras: ITotal;
  totalIngresos: ITotal;
  totalEgresos: ITotal;
  montoFinalSistema: ITotal;
  montoDeclaradoPorUsuario: number | null;
  diferencia: number | null;
  ventas: string[];
  compras: string[];
}

export interface IBox {
  BoxesData: ICajaBrach[] | null;
  historyCashier: IHistoryCashier[] | null;
  create: ICreataCashRegister | null;
  boxState: ICajaBrach[] | null;
  status: IStatus;
  error: string | null;
}

const initialState: IBox = {
  BoxesData: null,
  historyCashier: null,
  create: null,
  boxState: [],
  status: 'idle',
  error: null,
};

export const createBox = createAsyncThunk(
  'cashRegister/create',
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
  'cashRegister/getAllByBranch',
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
  'cashRegister/open',
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
  'cashRegister/close',
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
  'cashRegister/getById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getboxId(id);
      return response;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const getHistoryCashiers = createAsyncThunk(
  'cashRegister/getHistoryCashier',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getHistoryCashier(id);
      return response;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export interface IGetUserCashier {
  usuarioId: string;
  sucursalId: string;
}

export const getUserCashier = createAsyncThunk(
  'cashRegister/getUserAndBranch',
  async (data: IGetUserCashier) => {
    try {
      const response = await getUserAndBranch(data);
      return response.data;
    } catch (error) {
      return handleThunkError(error);
    }
  }
);

export const boxSlice = createSlice({
  name: 'Boxes',
  initialState,
  reducers: {
    updateCashAmount: (
      state,
      action: PayloadAction<{
        cajaId: string;
        amount: number;
      }>
    ) => {
      if (state.BoxesData) {
        state.BoxesData.forEach((box) => {
          if (box._id === action.payload.cajaId) {
            box.montoEsperado = {
              $numberDecimal: action.payload.amount,
            };
          }
        });
      }
    },
  },
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
      .addCase(closeBoxes.fulfilled, (state, action) => {
        let cajaId = action.payload.cajaId || action.payload._id;

        if (state.BoxesData) {
          const boxIndex = state.BoxesData.findIndex(
            (box) => box._id === cajaId
          );
          if (boxIndex !== -1) {
            state.BoxesData[boxIndex].estado = 'CERRADA';
          }
        }
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
      })
      .addCase(getHistoryCashiers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getHistoryCashiers.fulfilled, (state, action) => {
        state.historyCashier = action.payload as unknown as IHistoryCashier[];
        state.status = 'succeeded';
      });
  },
});

export const { updateCashAmount } = boxSlice.actions;
export const boxReducer = boxSlice.reducer;
