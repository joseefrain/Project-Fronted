import { AxiosError } from 'axios';

export const handleAsyncThunkError = (error: Error) => {
  console.error('Async Thunk Error:', error);
  throw error;
};

export const handleThunkError = (error: unknown) => {
  const axiosError = error as AxiosError;

  if (axiosError.response) {
    return (
      // @ts-ignore
      axiosError.response.data?.errors?.[0]?.message ||
      'Ocurrió un error en la solicitud'
    );
  }

  return handleAsyncThunkError(error as Error);
};
