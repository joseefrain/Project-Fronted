import { AxiosResponse } from 'axios';
import { createAxiosInstance, PATH_LIST } from '../axios';
import { Token } from '../../../shared/hooks/useJWT';

export interface ICreataCashRegister {
  sucursalId: string;
  usuarioAperturaId: string;
  montoInicial: number;
  consecutivo?: number;
}

export const craeteBox = async ({
  ...box
}: ICreataCashRegister): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Cashier);
  const response = await axiosInstance.post('/create', box);
  return response;
};

export const getboxBranch = async (id: string): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Cashier);
  const response = await axiosInstance.get(`/${id}/branch`);
  return response.data;
};

export const getboxId = async (id: string): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Cashier);
  const response = await axiosInstance.get(`/${id}`);
  return response.data;
};
