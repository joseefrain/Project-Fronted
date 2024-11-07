import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { handleThunkError } from '../../shared/utils/errorHandlers';
import {
  IShippedOrder,
  IPendingTransfer,
  ITransfer,
  ITransferPost,
  ITransferSlice,
  IDetalleSelected,
  ITrasladoRecepcion,
} from '@/interfaces/transferInterfaces';
import {
  createReceiveTransfer,
  createTransfer,
  fetchPendingTransfers,
  getAllOrdersReceipts,
  getAllOrdersReceivedById,
  getAllTransfer,
  returnProductsShipping,
} from '@/api/services/transfer';
import { IStatus } from '@/interfaces/branchInterfaces';

const initialState: ITransferSlice = {
  data: [],
  sent: [],
  received: [],
  dataBranchReceived: [],
  pending: [],
  selectedItem: null,
  selectedPending: null,
  status: 'idle',
  receivedStatus: 'idle',
  error: null,
};

export const createProductTransfer = createAsyncThunk(
  'transfer/create',
  async (transfer: ITransferPost, { rejectWithValue }) => {
    try {
      const response = await createTransfer(transfer);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const getAllProductTransfer = createAsyncThunk(
  'transfer/Send',
  async (_id: string) => {
    const response = await getAllTransfer(_id);
    return response;
  }
);

export const getPendingTransfers = createAsyncThunk(
  'transfer/getPending',
  async (sucursalId: string, { rejectWithValue }) => {
    try {
      const response = await fetchPendingTransfers(sucursalId);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const receiveTransfer = createAsyncThunk(
  'transfer/receive',
  async (sucursalId: string, { rejectWithValue }) => {
    try {
      const response = await getAllOrdersReceipts(sucursalId);
      return response;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const OrdersReceivedById = createAsyncThunk(
  'transfer/OrdersReceivedById',
  async (sucursalId: string, { rejectWithValue }) => {
    try {
      const response = await getAllOrdersReceivedById(sucursalId);
      return response;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const getPendingProductsByTransfer = createAsyncThunk(
  'transfer/productsByTransfer',
  async (transferId: string, { rejectWithValue }) => {
    try {
      const response = await getAllOrdersReceivedById(transferId);
      return response;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const createProductReceived = createAsyncThunk(
  'transfer/receiveTransfer',
  async (transfer: ITrasladoRecepcion, { rejectWithValue }) => {
    try {
      const response = await createReceiveTransfer(transfer);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const returnProducts = createAsyncThunk(
  'transfer/returnProductsShipping',
  async (transferId: string, { rejectWithValue }) => {
    try {
      const response = await returnProductsShipping(transferId);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

const transferSlice = createSlice({
  name: 'transfer',
  initialState,
  reducers: {
    updateStatus: (state, action: PayloadAction<IStatus>) => {
      state.status = action.payload;
    },
    updateReceivedStatus: (state, action: PayloadAction<IStatus>) => {
      state.receivedStatus = action.payload;
    },
    setTransferData(state, action: PayloadAction<IShippedOrder[]>) {
      state.data = action.payload;
    },
    clearTransferData(state) {
      state.data = [];
    },
    clearTransferDataReceived(state) {
      state.dataBranchReceived = [];
    },
    setPendingSelected(state, action: PayloadAction<IDetalleSelected | null>) {
      state.selectedPending = action.payload;
    },
    setSelectItemDetail: (state, action: PayloadAction<IDetalleSelected>) => {
      state.selectedItem = {
        traslado: action.payload.traslado,
        listItemDePedido: action.payload.listItemDePedido,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProductTransfer.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        createProductTransfer.fulfilled,
        (state, { payload }: PayloadAction<ITransfer>) => {
          state.status = 'succeeded';
          state.sent = [...state.sent, payload];
        }
      )
      .addCase(createProductTransfer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'unknown error';
      })
      .addCase(getAllProductTransfer.pending, (state) => {
        state.status = 'loading';
      })

      .addCase(getAllProductTransfer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'unknown error';
      })

      .addCase(getAllProductTransfer.fulfilled, (state, payload) => {
        state.status = 'succeeded';
        state.data = [
          ...state.data,
          ...(payload.payload as unknown as IShippedOrder[]),
        ];
      })
      .addCase(getPendingTransfers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        getPendingTransfers.fulfilled,
        (state, { payload }: PayloadAction<IPendingTransfer[]>) => {
          state.status = 'succeeded';
          state.pending = payload;
        }
      )

      .addCase(receiveTransfer.pending, (state) => {
        state.receivedStatus = 'loading';
      })

      .addCase(receiveTransfer.fulfilled, (state, payload) => {
        state.status = 'succeeded';
        state.dataBranchReceived = [
          ...state.dataBranchReceived,
          ...(payload.payload as unknown as IPendingTransfer[]),
        ];
      })
      .addCase(OrdersReceivedById.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';

        state.selectedItem = {
          traslado: payload.data?.traslado,
          listItemDePedido: payload.data?.listItemDePedido,
        };
      })
      .addCase(getPendingProductsByTransfer.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getPendingProductsByTransfer.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        const data = payload as unknown as IDetalleSelected;

        state.selectedPending = {
          traslado: data.traslado,
          listItemDePedido: data.listItemDePedido,
        };
      })
      .addCase(createProductReceived.pending, (state) => {
        state.receivedStatus = 'loading';
      })
      .addCase(createProductReceived.fulfilled, (state, { payload }) => {
        state.received = [...state.received, payload];
        state.receivedStatus = 'succeeded';
      });
  },
});

export const {
  setTransferData,
  clearTransferData,
  updateStatus,
  setPendingSelected,
  setSelectItemDetail,
  updateReceivedStatus,
  clearTransferDataReceived,
} = transferSlice.actions;

export const transferReducer = transferSlice.reducer;
