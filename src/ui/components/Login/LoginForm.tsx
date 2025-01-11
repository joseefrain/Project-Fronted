import { InicioSesion, openDrawer } from '@/app/slices/login';
import { store } from '@/app/store';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { toast, Toaster } from 'sonner';

interface ILoginData {
  username: string;
  password: string;
  role: 'admin' | 'user' | 'root';
}

const LoginForm = () => {
  const [credentials, setCredentials] = useState<ILoginData>({
    username: '',
    password: '',
    role: 'user',
  });
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { username, password } = credentials;
    const payload = { username, password };

    try {
      await store.dispatch(InicioSesion({ userCredentials: payload })).unwrap();

      toast.success('Sesión iniciada exitosamente');
      const storedData = localStorage.getItem('user');

      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const role = parsedData?.user?.role;

        if (role === 'root') {
          console.log('root', role);
          store.dispatch(openDrawer());
        }
      } else {
        console.log('No hay datos en localStorage');
      }

      navigate('/');
    } catch (error) {
      toast.error('Error al iniciar sesión: ' + error);
    }
  };

  return (
    <>
      <Toaster richColors position="bottom-right" />
      <motion.form
        onSubmit={handleSubmit}
        className=" bg-gray-50 shadow-md rounded-lg p-6 max-w-md mt-10 w-full dark:bg-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h1>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Nombre de Usuario:
          </label>
          <Input
            className="dark:bg-gray-900 dark:text-white dark:border-white"
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Contraseña:
          </label>
          <Input
            className="dark:bg-gray-900 dark:text-white dark:border-white"
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded py-2"
        >
          Iniciar Sesión
        </button>
      </motion.form>
    </>
  );
};

export default LoginForm;
