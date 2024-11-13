import { productsCatetories } from '@/app/slices/groups';
import { fetchProductsByBranchId } from '../../app/slices/branchSlice';
import { store } from '../../app/store';
import { IProductoGroups, ITablaBranch } from '@/interfaces/branchInterfaces';

export const GetBranches = async (id: string): Promise<ITablaBranch[]> => {
  try {
    const response = await store.dispatch(fetchProductsByBranchId(id)).unwrap();
    return response;
  } catch (error) {
    console.error('Error fetching branches:', error);
    throw new Error('Failed to fetch branches');
  }
};

export const GetProductsByGroup = async (
  id: string
): Promise<IProductoGroups[]> => {
  try {
    const response = await store.dispatch(productsCatetories(id)).unwrap();
    return response;
  } catch (error) {
    console.error('Error fetching branches:', error);
    throw new Error('Failed to fetch branches');
  }
};
