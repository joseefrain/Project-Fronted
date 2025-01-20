import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { handleThunkError } from '../../shared/utils/errorHandlers';
import {
  findProductoGrupoByProductId,
  inventoryAllProduct,
  inventoryGetAll,
  inventoryGetProdutsTransit,
  inventoryUpdateProduct,
} from '@/api/services/products';
import { IStatus, ITablaBranch } from '@/interfaces/branchInterfaces';
import { IProductInTransit } from '@/interfaces/transferInterfaces';
import { getProductsByBranchId } from '../../api/services/branch';
import { deleteProduct } from '../../api/services/transfer';

export const fetchTablaBranches = createAsyncThunk(
  'tablaBranches/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await inventoryGetAll();
      return response as unknown as ITablaBranch[];
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const productsTransit = createAsyncThunk(
  'products/getAllTransit',
  async (sucursalId: string, { rejectWithValue }) => {
    try {
      const response = await inventoryGetProdutsTransit(sucursalId);
      return response;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/update',
  async (product: ITablaBranch, { rejectWithValue }) => {
    try {
      const response = await inventoryUpdateProduct(product);
      return response;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const findProductoGrupoByProductIdAC = createAsyncThunk(
  'products/producto-grupo',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await findProductoGrupoByProductId(productId);
      return response;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const fetchProductsByBranchId = createAsyncThunk<ITablaBranch[], string>(
  'branches/fetchProductsById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response: ITablaBranch[] = await getProductsByBranchId(id);
      return response;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const fetchAllProducts = createAsyncThunk<
  ITablaBranch[],
  void,
  { rejectValue: string }
>('products/getAll', async (_, { rejectWithValue }) => {
  try {
    const response = await inventoryAllProduct();
    return response;
  } catch (error) {
    return rejectWithValue(handleThunkError(error));
  }
});

export const removeProduct = createAsyncThunk(
  'branches/deleteProduct',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await deleteProduct(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

interface ProductState {
  products: ITablaBranch[];
  error: string | null;
  transitProducts: IProductInTransit[];
  status: IStatus;
}

const initialState: ProductState = {
  products: [] as ITablaBranch[],
  transitProducts: [],
  status: 'idle',
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    updateStatus: (state, action: PayloadAction<IStatus>) => {
      state.status = action.payload;
    },
    clearProducts: (state) => {
      state.products = [];
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchTablaBranches.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTablaBranches.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.products = payload;
      })

      .addCase(fetchAllProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllProducts.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.products = payload;
      })
      .addCase(fetchAllProducts.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error = payload || 'Error fetching products';
      })
      .addCase(productsTransit.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(productsTransit.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        console.log(payload, 'data');
        state.transitProducts = payload as unknown as IProductInTransit[];
      })
      .addCase(updateProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductsByBranchId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductsByBranchId.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.products = payload;
      })

      .addCase(removeProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = state.products.filter(
          (branch) => branch.id !== action.meta.arg
        );
      })

      .addCase(removeProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error desconocido';
      })
      .addCase(removeProduct.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      });
  },
});

export const { clearProducts } = productsSlice.actions;
export const productsReducer = productsSlice.reducer;
