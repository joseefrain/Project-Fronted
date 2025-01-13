// components/PrivateRoute.tsx
import { RootState } from '@/app/store';
import AuthForm from '@/ui/components/Login';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuthToken } from '../hooks/useJWT';
import { hasLevelInModuleByRoles, LEVEL_VALUES } from './roleHelper';

export interface IRequireAuthProps {
  module: string;
}

export const RequireAuth = ({ module }: IRequireAuthProps) => {
  const navigate = useNavigate();
  const { token } = useAuthToken();
  const user = useSelector((state: RootState) => state.auth.signIn.user);

  const hasReadAccess = hasLevelInModuleByRoles(
    user?.roles ?? [],
    module,
    LEVEL_VALUES.READ
  );

  useEffect(() => {
    if (!token) {
      navigate('/login');
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
