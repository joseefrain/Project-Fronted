import { AxiosResponse } from 'axios';
import {
  createAxiosInstance,
  createAxiosInstanceForTransaction,
  PATH_LIST,
} from '../axios';
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
  const axiosInstance = createAxiosInstanceForTransaction(
    Token(),
    PATH_LIST.Queue
  );
  const response = await axiosInstance.post('/', data);
  return response;
};

export const getSaleByBranchId = async (id: string): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Sales);
  const response = await axiosInstance.get(`/venta/${id}/branch`);
  return response;
};

export const getCashier = async (id: string): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Cashier);
  const response = await axiosInstance.get(`/${id}`);
  return response;
};

export const openCashierService = async (
  sucursalId: string,
  userId: string
): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Cashier);
  const response = await axiosInstance.post(`/`, {
    sucursalId,
    usuarioAperturaId: userId,
    montoInicial: 2000,
  });
  return response;
};

export const postPurchase = async ({
  ...data
}: ISale): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstanceForTransaction(
    Token(),
    PATH_LIST.Queue
  );
  const response = await axiosInstance.post('/', data);
  return response;
};

export const getPurchaseByBranchId = async (
  id: string
): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Sales);
  const response = await axiosInstance.get(`/compra/${id}/branch`);
  return response;
};
