import { RootState, store } from '@/app/store';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { hasTokenExpired, useAuthToken } from '../hooks/useJWT';
import { PAGES_MODULES } from './roleHelper';
import { useRoleAccess } from '../hooks/useRoleAccess';
import { logout } from '../../app/slices/login';

export interface IRequireAuthProps {
  module: PAGES_MODULES;
}

export const RequireAuth = ({ module }: IRequireAuthProps) => {
  const navigate = useNavigate();
  const access = useRoleAccess(module);
  const { token } = useAuthToken();

  useEffect(() => {
    if (!token || hasTokenExpired(token)) {
      window.location.reload();
      console.log('TOKEN EXPIRADO en RequireAuth');
      localStorage.removeItem('user');
      store.dispatch(logout());
      //   handleAuthentication('', false, navigate);
      return;
    }

    if (!access.read) {
      console.log('Acceso denegado al módulo. Redirigiendo al 404.');
      navigate('/404');
    }
  }, [token, navigate, access]);

  return <Outlet />;
};

interface Access {
  children: React.ReactNode;
}

export const AlreadyAuthenticated = ({ children }: Access) => {
  const { token, status } = useSelector(
    (state: RootState) => state.auth.signIn
  );
  return status === 'authenticated' && token ? (
    <Navigate to="/" />
  ) : (
    <>{children}</>
  );
};
