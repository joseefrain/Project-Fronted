import { AxiosResponse } from 'axios';
import { createAxiosInstance, PATH_LIST } from '../axios';
import { Token } from '../../../shared/hooks/useJWT';
import { IEntities } from '../../../interfaces/entitiesInterfaces';

export const createEntity = async (entity: any): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Entities);
  const response = await axiosInstance.post('/', entity);
  console.log(response, 'responseAPI');
  return response;
};

export const getAllEntities = async (): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Entities);
  const response = await axiosInstance.get('/');
  return response.data;
};

export const deleteEntity = async (id: string): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Entities);
  const response = await axiosInstance.delete(`/${id}`);
  return response.data;
};

export const updateEntity = async (
  entity: IEntities,
  id: string
): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Entities);
  const response = await axiosInstance.put(`/${id}`, entity);
  return response.data;
};
