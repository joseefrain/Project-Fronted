// components/PrivateRoute.tsx
import { RootState } from '@/app/store';
import AuthForm from '@/ui/components/Login';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import {
  handleAuthentication,
  hasTokenExpired,
  useAuthToken,
} from '../hooks/useJWT';
import { hasLevelInModuleByRoles, LEVEL_VALUES } from './roleHelper';

export interface IRequireAuthProps {
  module: string;
}

export const RequireAuth = ({ module }: IRequireAuthProps) => {
  const navigate = useNavigate();
  const { token } = useAuthToken();
  const user = useSelector((state: RootState) => state.auth.signIn.user);

  const hasReadAccess = token
    ? hasLevelInModuleByRoles(user?.roles ?? [], module, LEVEL_VALUES.READ)
    : false;

  useEffect(() => {
    if (!token || hasTokenExpired(token)) {
      handleAuthentication('', false, navigate);
      return;
    }

    if (!hasReadAccess) {
      navigate('/404');
    }
  }, [token, user, navigate, hasReadAccess]);

  return <Outlet />;
};

export const AlreadyAuthenticated: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth.signIn);

  if (token) {
    return <Navigate to="/" />;
  }
  return <AuthForm />;
};

export interface IToken {
  token: string;
  role?: string;
}
export const getUserDataFromLocalStorage = (): IToken | null => {
  const userDataString = localStorage.getItem('user');

  if (userDataString) {
    return JSON.parse(userDataString);
  } else {
    return null;
  }
};
