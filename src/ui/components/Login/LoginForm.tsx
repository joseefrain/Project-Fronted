import {
  InicioSesion,
  openDrawer,
  openDrawerCashRegister,
} from '@/app/slices/login';
import { store } from '@/app/store';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { toast, Toaster } from 'sonner';
import { ROLE } from '../../../interfaces/roleInterfaces';
import logofondo from '../../../assets/logofondo.jpg';
import { SvgComponent } from '@/assets';

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

        if (role === ROLE.ROOT) {
          store.dispatch(openDrawer());
        }

        if (role !== ROLE.ROOT) {
          store.dispatch(openDrawerCashRegister());
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
      <div className={`min-h-screen w-full flex flex-col md:flex-row }`}>
        <div className="w-full md:w-1/2 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6 md:p-12 flex flex-col justify-center items-start relative overflow-hidden min-h-[300px] md:min-h-screen">
          <motion.div
            className="absolute inset-0"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'], // Mover de arriba a la derecha
            }}
            transition={{
              duration: 20, // Duración de la animación en segundos
              repeat: Infinity, // Repetir indefinidamente
              ease: 'linear', // Movimiento constante y fluido
            }}
            style={{
              backgroundImage: `url(${logofondo})`,
              backgroundSize: 'auto', // Asegura que la imagen mantenga sus dimensiones originales
              backgroundRepeat: 'repeat', // Repetir la imagen
              backgroundPosition: '0% 0%', // Posición inicial
            }}
          />
        </div>
        <div className="flex flex-col items-center justify-center w-full p-6 bg-white md:w-1/2 dark:bg-gray-800 md:p-12">
          <div className="w-full max-w-md space-y-4 md:space-y-6">
            <div className="flex justify-center items-">
              <SvgComponent className="size-[200px]" />
            </div>

            <motion.form
              onSubmit={handleSubmit}
              className="w-full max-w-md p-6 mt-10 rounded-lg shadow-md bg-gradient-to-b from-green-200 to-white dark:bg-gray-800"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block mb-3 text-sm font-medium text-gray-700 uppercase dark:text-white font-onest"
                >
                  Nombre de Usuario:
                </label>
                <Input
                  className="w-full h-12 px-4 text-gray-900 bg-white rounded-lg dark:bg-gray-700 dark:text-white font-onest"
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
                  className="block mb-3 text-sm font-medium text-gray-700 uppercase dark:text-white font-onest"
                >
                  Contraseña:
                </label>
                <Input
                  className="w-full h-12 px-4 text-gray-900 bg-white rounded-lg dark:bg-gray-700 dark:text-white font-onest"
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
                className="w-full h-12 text-white uppercase transition-colors bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 dark:text-gray-900"
              >
                Iniciar Cesión
              </button>
            </motion.form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
