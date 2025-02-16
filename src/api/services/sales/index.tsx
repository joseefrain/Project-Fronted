import { AxiosResponse } from 'axios';
import {
  createAxiosInstance,
  createAxiosInstanceForTransaction,
  PATH_LIST,
} from '../axios';
import { Token } from '@/shared/hooks/useJWT';
import {
  INewSale,
  ITransactionReturn,
  ITransactionReturnResponse,
  ITypeTransaction,
} from '@/interfaces/salesInterfaces';
import { IDescuentoCreate } from '@/interfaces/salesInterfaces';
import { IDescuentoDeleteParams } from '../../../app/slices/salesSlice';

export const createDiscount = async ({
  ...data
}: IDescuentoCreate): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.SalesDiscounts);
  const response = await axiosInstance.post('/', data);
  return response;
};

export const deleteDiscount = async ({
  ...params
}: IDescuentoDeleteParams): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.SalesDiscounts);
  const response = await axiosInstance.post(
    `/${params.id}`,
    params as unknown as IDescuentoCreate
  );
  return response;
};

export const updateDiscount = async (
  data: IDescuentoCreate
): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.SalesDiscounts);
  const response = await axiosInstance.put(`/${data._id}`, data);
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

export const postSale = async ({
  ...data
}: INewSale): Promise<AxiosResponse> => {
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
}: INewSale): Promise<AxiosResponse> => {
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

export const postTransactionReturn = async ({
  ...data
}: ITransactionReturn): Promise<AxiosResponse<ITransactionReturnResponse>> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Sales);
  const response = await axiosInstance.post(PATH_LIST.Return, data);
  return response;
};

export const getTransactionReturnByBranchId = async (
  id: string,
  type: ITypeTransaction
): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Sales);
  const response = await axiosInstance.get(
    `${PATH_LIST.Return}/${id}/${type}/branch`
  );
  return response;
};
