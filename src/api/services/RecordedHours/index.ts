import { AxiosResponse } from 'axios';
import { createAxiosInstance, PATH_LIST } from '../axios';
import { Token } from '../../../shared/hooks/useJWT';
import {
  IGetRecordedHours,
  IRecordedHours,
  IUpdateRecordedHours,
} from '../../../interfaces/workHours';

export const createRecordedHours = async (
  recordedHours: IRecordedHours
): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.RecordedHours);
  const response = await axiosInstance.post('/', recordedHours);
  return response.data;
};

export const getRecordedHours = async ({
  startDate,
  endDate,
  sucursalId,
}: IGetRecordedHours): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.RecordedHours);
  const response = await axiosInstance.get(
    `/sucursal/${sucursalId}?startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
};

export const exitRecordedHours = async (id: string): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.RecordedHours);
  const response = await axiosInstance.patch(`/${id}/exit`);
  return response.data;
};

export const updateRecordedHours = async (
  hour: IUpdateRecordedHours
): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance(Token(), PATH_LIST.RecordedHours);
  const response = await axiosInstance.post(`/working-hours`, hour);
  return response.data;
};
