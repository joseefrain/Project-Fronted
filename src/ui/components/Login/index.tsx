import { useLocation } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export const AuthForm = () => {
  const location = useLocation();

  return (
    <div className="auth-form-container h-[100vh] flex justify-center items-center w-full ">
      <h2>{location.pathname === '/register' ? '' : ''}</h2>
      {location.pathname === '/register' ? <RegisterForm /> : <LoginForm />}
    </div>
  );
};

export default AuthForm;
