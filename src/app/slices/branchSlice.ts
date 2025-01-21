// imports necesarios
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import {
  createBranch,
  deleteBranchById,
  getAll,
  getForStockProductsAtBranch,
  updateBranch,
  getBranchById,
} from '../../api/services/branch';
import {
  handleAsyncThunkError,
  handleThunkError,
} from '../../shared/utils/errorHandlers';
import {
  Branch,
  BranchState,
  IBranchWithProducts,
  ITablaBranch,
} from '@/interfaces/branchInterfaces';
import { InventarioSucursalWithPopulated } from '@/interfaces/transferInterfaces';
import { updateProduct } from '@/api/services/transfer';
import { createTablaBranch } from '@/api/services/products';

export const searchForStockProductsAtBranch = createAsyncThunk<
  InventarioSucursalWithPopulated[],
  string
>(
  'branches/searchForStockProductsAtBranch',
  async (id: string, { rejectWithValue }) => {
    try {
      const response: InventarioSucursalWithPopulated[] =
        await getForStockProductsAtBranch(id);
      return response;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const fetchBranches = createAsyncThunk('branches/getAll', async () => {
  try {
    const response = await getAll();
    return response as unknown as Branch[];
  } catch (error) {
    return (error as AxiosError).response?.status === 404
      ? []
      : handleAsyncThunkError(error as Error);
  }
});

export const updateBranchs = createAsyncThunk(
  'branches/update',
  async (payload: { branch: Branch; id: string }) => {
    try {
      const { branch, id } = payload;
      const response = await updateBranch(branch, id);
      return response as unknown as Branch;
    } catch (error) {
      handleAsyncThunkError(error as Error);
      throw error;
    }
  }
);

export const deleteBranch = createAsyncThunk(
  'branches/delete',
  async (_id: string) => {
    const response = await deleteBranchById(_id!);
    return response;
  }
);

export const createBranchs = createAsyncThunk(
  'branches/create',
  async (branch: Branch, { rejectWithValue }) => {
    try {
      const response = await createBranch(branch);
      return response.data as Branch;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const createProduct = createAsyncThunk(
  'branches/createProduct',
  async (product: ITablaBranch, { rejectWithValue }) => {
    try {
      const response = await createTablaBranch(product);
      return response.data as ITablaBranch;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const updatedProduct = createAsyncThunk(
  'branches/updateProduct',
  async (product: { id: string; data: ITablaBranch }, { rejectWithValue }) => {
    try {
      const response = await updateProduct(product.id, product.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const fetchBranchById = createAsyncThunk(
  'branches/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getBranchById(id);
      return response;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

const initialState: BranchState = {
  data: [],
  selectedBranch: null,
  status: 'idle',
  error: null,
  loading: false,
};

const branchesSlice = createSlice({
  name: 'branches',
  initialState,
  reducers: {
    AddingBranchs: (state, action: PayloadAction<Branch>) => {
      state.data.push(action.payload);
    },
    setSelectedBranch: (state, action: PayloadAction<Branch>) => {
      state.selectedBranch = {
        ...action.payload,
        products: state.selectedBranch?.products ?? [],
      };
    },
    updateSelectedBranch: (
      state,
      action: PayloadAction<IBranchWithProducts | null>
    ) => {
      state.selectedBranch = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateBranchs.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          (branch) => branch._id === action.payload._id
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(fetchBranches.pending, (state) => {
        state.data = [];
        state.status = 'loading';
      })
      .addCase(
        fetchBranches.fulfilled,
        (state, { payload }: PayloadAction<Array<Branch>>) => {
          state.status = 'succeeded';
          state.data = payload;
        }
      )
      .addCase(fetchBranches.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'unknown error';
      })

      .addCase(createBranchs.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        createBranchs.fulfilled,
        (state, action: PayloadAction<Branch>) => {
          state.status = 'succeeded';
          state.data.push(action.payload);
        }
      )
      .addCase(createBranchs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'unknown error';
      })
      .addCase(deleteBranch.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = state.data.filter(
          (branch) => branch._id !== action.meta.arg
        );
      })
      .addCase(deleteBranch.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error desconocido';
      })
      .addCase(createProduct.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.selectedBranch = {
          ...state.selectedBranch!,
          products: [...state.selectedBranch!.products, payload],
        };
      });
  },
});

export const { setSelectedBranch, updateSelectedBranch } =
  branchesSlice.actions;
export const branchesReducer = branchesSlice.reducer;
