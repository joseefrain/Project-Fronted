import axios, { AxiosInstance } from 'axios';

export enum PATH_LIST {
  Login = 'users',
  Branch = 'branches',
  Inventory = 'inventory/products',
  Groups = 'inventory/groups',
  Transfer = 'transfer',
  SalesDiscounts = 'transaccion/descuentos',
  Sales = 'transaccion/',
  Cashier = 'cashRegister',
  Entities = 'entity',
  Credits = 'credito',
  BranchCredits = 'credito/BySucursalId',
  PagoCredito = 'pagoCredito',
  Queue = '/createTransactionQueue',
  ROLES = 'roles',
  COINS = 'coin',
  DASHBOARD = 'dashboard/',
  Return = 'devolucion',
  RecordedHours = 'daily-registers',
}

export const createAxiosInstance = (
  JWT: string | null,
  PATH: string
): AxiosInstance => {
  const baseURL = `${import.meta.env.VITE_API_URL_BACKEND?.replace(/\/?$/, '/')}${PATH}`;

  const headers = {
    Authorization: `Bearer ${JWT}`,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  return axios.create({
    baseURL,
    headers,
  });
};

export const createAxiosInstanceForTransaction = (
  JWT: string | null,
  PATH: string
): AxiosInstance => {
  const baseURL = `${import.meta.env.VITE_API_URL_QUEUE?.replace(/\/?$/, '')}${PATH}`;

  const headers = {
    Authorization: `Bearer ${JWT}`,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  return axios.create({
    baseURL,
    headers,
  });
};
