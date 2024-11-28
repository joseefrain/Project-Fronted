import axios, { AxiosInstance } from 'axios';

export enum PATH_LIST {
  Login = 'users',
  Branch = 'branches',
  Inventory = 'inventory/products',
  Groups = 'inventory/groups',
  Transfer = 'transfer',
  SalesDiscounts = 'venta/descuentos',
  Sales = 'venta/',
  Cashier = 'cashRegister',
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
