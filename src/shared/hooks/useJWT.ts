import { useEffect, useRef, useState } from 'react';
import { getUserDataFromLocalStorage } from '../helpers/login.Helper';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { updateSignIn } from '../../app/slices/login';
import { store } from '../../app/store';

export interface IToken {
  token: string;
  role?: string;
}

export interface AuthState {
  token: string;
  username: string;
  password: string;
  role: string;
  status: 'authenticated' | 'unauthenticated';
}

export const useAuthToken = () => {
  const initialToken = useRef(getUserDataFromLocalStorage()?.token || '');
  const [token, setToken] = useState<string>(initialToken.current);
  const navigate = useNavigate();
  const hasCheckedToken = useRef(false);

  useEffect(() => {
    const checkToken = async () => {
      if (!token || hasTokenExpired(token)) {
        alert('TOKEN EXPIRADO');
        handleAuthentication('', false, navigate);
        setToken('');
      }
    };

    if (!hasCheckedToken.current) {
      checkToken();
      hasCheckedToken.current = true;
    }
  }, [token, navigate]);

  return { token };
};

export const hasTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    return exp < currentTime;
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return true;
  }
};

export const handleAuthentication = (
  token: string,
  isAuth: boolean,
  navigate?: NavigateFunction
) => {
  const authState: AuthState = {
    token,
    username: '',
    password: '',
    role: '',
    status: isAuth ? 'authenticated' : 'unauthenticated',
  };

  store.dispatch(updateSignIn(authState));

  if (!isAuth && navigate) {
    navigate('/login');
  }
};

export const Token = () => {
  const TOKEN_KEY = getUserDataFromLocalStorage() as IToken;
  const dateInit = TOKEN_KEY?.token;
  return dateInit;
};
