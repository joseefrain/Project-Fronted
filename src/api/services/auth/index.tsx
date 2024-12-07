import axios, { AxiosResponse } from 'axios';
import { createAxiosInstance, PATH_LIST } from '../axios';

export interface Iauth {
  username: string;
  password: string;
  role?: 'admin' | 'user' | 'root';
}

export const createUsers = async (
  userCreate: Iauth
): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance('', PATH_LIST.Login);
  const response = await axiosInstance.post('/', userCreate);
  return response;
};

export const registerUsers = async (signIN: Iauth): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance('', PATH_LIST.Login);
  const response = await axiosInstance.post('/login', signIN);
  return response;
};

export const getAllUsers = async (): Promise<AxiosResponse> => {
  const response = await axios.get(`${URL}users`);
  return response;
};
