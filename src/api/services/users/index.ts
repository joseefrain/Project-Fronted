import { AxiosResponse } from 'axios';
import { createAxiosInstance, PATH_LIST } from '../axios';
import { Token } from '../../../shared/hooks/useJWT';

export const fetchUsers = async (): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Login);
  const response = await axiosInstance.get('/');
  return response;
};

export const deleteUser = async (id: string): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Login);
  const response = await axiosInstance.delete(`/${id}`);
  return response;
};
