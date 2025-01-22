import { store } from '../../app/store';
import { ITablaBranch } from '@/interfaces/branchInterfaces';
import { fetchProductsByBranchId } from '../../app/slices/productsSlice';

export const GetBranches = async (id: string): Promise<ITablaBranch[]> => {
  try {
    const response = await store.dispatch(fetchProductsByBranchId(id)).unwrap();

    return response;
  } catch (error: any) {
    console.error('Error fetching branches:', error);
    throw new Error(`Failed to fetch branches: ${error.message || error}`);
  }
};
