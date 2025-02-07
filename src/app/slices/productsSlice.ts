import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { handleThunkError } from '../../shared/utils/errorHandlers';
import {
  createTablaBranch,
  deleteProduct,
  findProductoGrupoByProductId,
  inventoryAllProduct,
  inventoryGetAll,
  inventoryGetProdutsTransit,
  inventoryUpdateProduct,
  updateProductApi,
  updateProductApiProps,
} from '@/api/services/products';
import { IStatus, ITablaBranch } from '@/interfaces/branchInterfaces';
import { IProductInTransit } from '@/interfaces/transferInterfaces';
import { getProductsByBranchId } from '../../api/services/branch';

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

export const fetchAllProducts = createAsyncThunk(
  'products/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await inventoryAllProduct();
      return response;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

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

export const updateProductsOriginal = createAsyncThunk(
  'products/updateOriginal',
  async ({ product, _id }: updateProductApiProps, { rejectWithValue }) => {
    try {
      const response = await updateProductApi({ product, _id });
      return response;
    } catch (error) {
      return rejectWithValue(handleThunkError(error));
    }
  }
);

export const productByBranchId = createAsyncThunk(
  'products/getProductById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getProductsByBranchId(id);
      return response;
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
  allProducts: ITablaBranch[] | null;
}

const initialState: ProductState = {
  products: [],
  allProducts: null,
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

      .addCase(fetchAllProducts.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.products = payload;
        state.allProducts = payload;
      })
      .addCase(fetchAllProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(productsTransit.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(productsTransit.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.transitProducts = payload as unknown as IProductInTransit[];
      })
      .addCase(updateProductsOriginal.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProductsOriginal.fulfilled, (state, action) => {
        state.status = 'succeeded';

        const updatedProducts = state.products.map((product) => {
          if (
            product.inventarioSucursalId &&
            //@ts-ignore
            product.inventarioSucursalId === action.payload._id
          ) {
            return { ...product, ...action.payload };
          }
          return product;
        });

        state.products = [...updatedProducts];
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
        state.products =
          state.products?.filter((branch) => branch.id !== action.meta.arg) ||
          [];
      })

      .addCase(removeProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error desconocido';
      })
      .addCase(removeProduct.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(productByBranchId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(productByBranchId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })

      .addCase(createProduct.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products = [...state.products!, action.payload];
        state.status = 'succeeded';
      });
  },
});

export const { clearProducts } = productsSlice.actions;
export const productsReducer = productsSlice.reducer;
