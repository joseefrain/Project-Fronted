import { InicioSesion, openDrawer } from '@/app/slices/login';
import { store } from '@/app/store';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { toast, Toaster } from 'sonner';
import { ROLE } from '../../../interfaces/roleInterfaces';

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
            className="absolute inset-0 opacity-40"
            animate={{
              backgroundPosition: ['0% 0%', '50% 50%'], // Animación de posición
            }}
            transition={{
              duration: 10, // Duración de la animación en segundos
              repeat: Infinity, // Repetir indefinidamente
              ease: 'linear', // Movimiento suave
            }}
            style={{
              backgroundImage:
                "url('https://www.civitatis.com/f/pseo/espana/madrid/gran-via-noche-madrid-1200.jpg')",
              backgroundSize: 'cover', // Ajusta la imagen al contenedor
              backgroundPosition: '0% 0%', // Posición inicial de la imagen
              backgroundRepeat: 'no-repeat', // Evita repeticiones
            }}
          />
        </div>

        {/* Right section with login form */}
        <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 p-6 md:p-12 flex flex-col justify-center items-center">
          <div className="w-full max-w-md space-y-4 md:space-y-6">
            <div className="text-center md:text-left flex justify-between items-center">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1 md:mb-2">
                  Hello Again!
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                  Welcome Back
                </p>
              </div>
            </div>

            <motion.form
              onSubmit={handleSubmit}
              className="w-full max-w-md p-6 mt-10 rounded-lg shadow-md  bg-gray-50 dark:bg-gray-800"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Nombre de Usuario:
                </label>
                <Input
                  className="w-full h-12 px-4 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                  className="w-full h-12 px-4 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                className="w-full h-12 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 transition-colors"
              >
                Iniciar Sesión
              </button>
            </motion.form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
