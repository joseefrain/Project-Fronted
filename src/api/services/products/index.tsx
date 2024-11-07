import { AxiosResponse } from 'axios';
import { createAxiosInstance, PATH_LIST } from '../axios';
import { Token } from '../../../shared/hooks/useJWT';
import { ITablaBranch } from '../../../interfaces/branchInterfaces';

export const createTablaBranch = async (
  branch: ITablaBranch
): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Inventory);
  const response = await axiosInstance.post('/', branch);
  return response;
};

export const inventoryGetAll = async (): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Inventory);
  const response = await axiosInstance.get('/');
  return response.data;
};

export const inventoryAllProduct = async (): Promise<ITablaBranch[]> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Inventory);
  const response: AxiosResponse<ITablaBranch[]> =
    await axiosInstance.get('/allProduct');
  return response.data;
};

export const inventoryGetProdutsTransit = async (
  sucursalId: string
): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Inventory);
  const response = await axiosInstance.get(`/${sucursalId}/transit`);
  return response.data;
};

export const inventoryUpdateProduct = async (
  branch: ITablaBranch
): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Inventory);
  const response = await axiosInstance.post('/', branch);
  return response.data;
};

export const findProductoGrupoByProductId = async (
  productoId: string
): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Inventory);
  const response = await axiosInstance.get(`/${productoId}/producto-grupo`);
  return response.data;
};
