// components/PrivateRoute.tsx
import { RootState } from '@/app/store';
import AuthForm from '@/ui/components/Login';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuthToken } from '../hooks/useJWT';

interface IPrivateRouteProps {
  rolesAllowed: Array<'admin' | 'user' | 'root'>;
}

export const RequireAuth: React.FC<IPrivateRouteProps> = ({ rolesAllowed }) => {
  const { token } = useAuthToken();
  const user = useSelector((state: RootState) => state.auth.signIn.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else if (user && !rolesAllowed.includes(user.role)) {
      navigate('/');
    }
  }, [token, user, rolesAllowed, navigate]);

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
