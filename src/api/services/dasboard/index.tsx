import { AxiosResponse } from 'axios';
import { Token } from '../../../shared/hooks/useJWT';
import { createAxiosInstance, PATH_LIST } from '../axios';

export const getDashboardProducts = async (
  id: string
): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.DASHBOARD);
  const response = await axiosInstance.get(`/${id}`);
  return response.data;
};
