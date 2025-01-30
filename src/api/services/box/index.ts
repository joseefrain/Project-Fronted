import { AxiosResponse } from 'axios';
import { createAxiosInstance, PATH_LIST } from '../axios';
import { Token } from '../../../shared/hooks/useJWT';
import {
  ICloseCash,
  ICreataCashRegister,
  IGetUserCashier,
  IOpenCash,
} from '../../../app/slices/cashRegisterSlice';

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

export const closeCashier = async ({
  ...closeCashier
}: ICloseCash): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Cashier);
  const response = await axiosInstance.post('/close', closeCashier);
  return response;
};

export const openCashier = async ({
  ...openCashier
}: IOpenCash): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Cashier);
  const response = await axiosInstance.post('/', openCashier);
  return response;
};

export const getUserAndBranch = async ({
  ...data
}: IGetUserCashier): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Cashier);
  const response = await axiosInstance.post('/userAndBranch', data);
  return response;
};
