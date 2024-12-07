import { AxiosResponse } from 'axios';
import { createAxiosInstance, PATH_LIST } from '../axios';
import { Token } from '../../../shared/hooks/useJWT';
import { IPostPagoCredito } from '../../../interfaces/creditsInterfaces';

export const fetchCreditsByBranch = async (
  id: string
): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.BranchCredits);
  const response = await axiosInstance.get(`/${id}`);
  return response.data;
};

export const postPayCredit = async (
  data: IPostPagoCredito
): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(
    Token(),
    `${PATH_LIST.Credits}/${PATH_LIST.PagoCredito}`
  );
  const response = await axiosInstance.post('/', data);
  return response.data;
};

export const fetchCreditById = async (id: string): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.Credits);
  const response = await axiosInstance.get(`/${id}`);
  return response.data;
};
