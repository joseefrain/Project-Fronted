import { AxiosResponse } from 'axios';
import { createAxiosInstance, PATH_LIST } from '../axios';
import { Token } from '@/shared/hooks/useJWT';
import { ISale } from '@/interfaces/salesInterfaces';
import { IDescuentoCreate } from '@/interfaces/salesInterfaces';

export const createDiscount = async ({
  ...data
}: IDescuentoCreate): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.SalesDiscounts);
  const response = await axiosInstance.post('/', data);
  return response;
};

export const getAllDiscounts = async (): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.SalesDiscounts);
  const response = await axiosInstance.get('/');
  return response;
};

export const getDiscountByBranchId = async (
  id: string
): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.SalesDiscounts);
  const response = await axiosInstance.get(`/${id}/branch`);
  return response;
};

export const postSale = async ({ ...data }: ISale): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Sales);
  const response = await axiosInstance.post('/', data);
  return response;
};

export const getSaleByBranchId = async (id: string): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Sales);
  const response = await axiosInstance.get(`/${id}/branch`);
  return response;
};
