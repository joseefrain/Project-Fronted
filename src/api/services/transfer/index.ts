import { AxiosResponse } from 'axios';
import { createAxiosInstance, PATH_LIST } from '../axios';
import { Token } from '@/shared/hooks/useJWT';
import {
  ITransferPost,
  ITrasladoRecepcion,
} from '@/interfaces/transferInterfaces';
import { ITablaBranch } from '../../../interfaces/branchInterfaces';

export const createTransfer = async ({
  ...transfer
}: ITransferPost): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Transfer);
  const response = await axiosInstance.post('/', transfer);
  return response;
};

export const getAllTransfer = async (
  sucursalId: string
): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Transfer);
  const response = await axiosInstance.get(`/${sucursalId}/enviados`);
  return response.data;
};

export const fetchPendingTransfers = async (
  sucursalId: string
): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Transfer);
  const response = await axiosInstance.get(`/recibir/${sucursalId}`);
  return response;
};

export const getAllOrdersReceipts = async (
  sucursalId: string
): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Transfer);
  const response = await axiosInstance.get(`/${sucursalId}/recibidos`);
  return response.data;
};

export const getAllOrdersReceivedById = async (
  sucursalId: string
): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Transfer);
  const response = await axiosInstance.get(`/${sucursalId}/itemdepedido`);

  return response.data;
};

export const createReceiveTransfer = async ({
  ...transfer
}: ITrasladoRecepcion): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Transfer);
  const response = await axiosInstance.post('/RecibirPedido', transfer);
  return response;
};

export const returnProductsShipping = async (
  transferId: string
): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Transfer);
  const response = await axiosInstance.get(`/${transferId}/devolver-producto`);
  return response;
};

export const deleteProduct = async (id: string): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Inventory);
  const response = await axiosInstance.delete(`/${id}`);
  return response;
};

//update producto
export const updateProduct = async (
  id: string,
  product: ITablaBranch
): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Inventory);
  const response = await axiosInstance.put(`/${id}`, product);
  return response;
};
