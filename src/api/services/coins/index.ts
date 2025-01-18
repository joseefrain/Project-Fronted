import { AxiosResponse } from 'axios';
import { createAxiosInstance, PATH_LIST } from '../axios';
import { Token } from '../../../shared/hooks/useJWT';
import { ICoins } from '../../../app/slices/coinsSlice';

export const getCoins = async (): Promise<AxiosResponse<ICoins[]>> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.COINS);
  const response = await axiosInstance.get('/');
  return response;
};
