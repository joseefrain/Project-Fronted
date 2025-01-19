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
import { PAGES_MODULES } from './roleHelper';
import { useRoleAccess } from '../hooks/useRoleAccess';

export interface IRequireAuthProps {
  module: PAGES_MODULES;
}

export const RequireAuth = ({ module }: IRequireAuthProps) => {
  const navigate = useNavigate();
  const access = useRoleAccess(module);
  const { token } = useAuthToken();

  useEffect(() => {
    if (!token || hasTokenExpired(token)) {
      handleAuthentication('', false, navigate);
      return;
    }

    if (!access.read) {
      navigate('/404');
    }
  }, [token, navigate, access]);

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
