import { AxiosResponse } from 'axios';
import { createAxiosInstance, PATH_LIST } from '../axios';
import { Token } from '../../../shared/hooks/useJWT';

export const fetchCreditsByBranch = async (
  id: string
): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.BranchCredits);
  const response = await axiosInstance.get(`/${id}`);
  return response.data;
};
