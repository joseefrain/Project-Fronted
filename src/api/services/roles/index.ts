import { AxiosResponse } from 'axios';
import { Token } from '../../../shared/hooks/useJWT';
import { createAxiosInstance, PATH_LIST } from '../axios';
import { IRole } from '../../../interfaces/roleInterfaces';

export const fetchRoles = async (): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.ROLES);
  const response = await axiosInstance.get('/');
  return response;
};

export const postRole = async ({ ...data }: IRole): Promise<AxiosResponse> => {
  // eslint-disable-next-line no-unused-vars
  const { _id, ..._data } = data;

  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.ROLES);
  const response = await axiosInstance.post('/', _data);
  return response;
};

export const deleteRole = async (id: string): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.ROLES);
  const response = await axiosInstance.delete(`/${id}`);
  return response;
};

export const updateRole = async (role: IRole): Promise<AxiosResponse> => {
  const { _id, ..._role } = role;

  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.ROLES);
  const response = await axiosInstance.put(`/${_id}`, _role);
  return response;
};
