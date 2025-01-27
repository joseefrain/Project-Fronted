import { useEffect, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { logout, updateSignIn } from '../../app/slices/login';
import { store } from '../../app/store';
import { useAppSelector } from '../../app/hooks';

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
  const initialToken = useAppSelector((state) => state.auth.signIn.token);
  const [token, setToken] = useState(initialToken);
  const navigate = useNavigate();
  const [isTokenChecked, setIsTokenChecked] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      if (!token || hasTokenExpired(token)) {
        alert('TOKEN EXPIRADO');
        setToken('');
        localStorage.removeItem('user');
        store.dispatch(logout());
        navigate('/login', { replace: true });
        return;
      }
      setIsTokenChecked(true);
    };

    if (!isTokenChecked) {
      checkToken();
    }
  }, [token, navigate, isTokenChecked]);

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

  console.log('Actualizando estado de autenticación en el store', authState);
  store.dispatch(updateSignIn(authState));

  if (!isAuth) {
    console.log('Eliminando usuario del localStorage y redirigiendo al login');
    localStorage.removeItem('user');
    if (navigate) {
      navigate('/login', { replace: true });
    }
  }
};

export const getUserDataFromLocalStorage = (): IToken | null => {
  const userDataString = localStorage.getItem('user');
  if (userDataString) {
    return JSON.parse(userDataString);
  } else {
    return null;
  }
};

export const Token = () => {
  const TOKEN_KEY = getUserDataFromLocalStorage() as IToken;
  const dateInit = TOKEN_KEY?.token;
  return dateInit;
};
