import { AxiosResponse } from 'axios';
import { Token } from '../../../shared/hooks/useJWT';
import { createAxiosInstance, PATH_LIST } from '../axios';

export interface IGetDashboardProducts {
  id: string;
  fechaInicio: string;
  fechaFin: string;
}

export const getDashboardProducts = async ({
  id,
  fechaInicio,
  fechaFin,
}: IGetDashboardProducts): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.DASHBOARD);
  const response = await axiosInstance.get(`/${id}/${fechaInicio}/${fechaFin}`);
  return response.data;
};
