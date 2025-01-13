import { useAppSelector } from '@/app/hooks';
import { fetchBranches } from '@/app/slices/branchSlice';
import { IUser } from '@/app/slices/login';
import { store } from '@/app/store';
import { ITablaBranch } from '@/interfaces/branchInterfaces';
import { GetBranches } from '@/shared/helpers/Branchs';
import { motion } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';
import './user.scss';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { getRoles } from '../../../app/slices/roleSlice';
import { MultiSelect } from '../../../components/ui/MultiSelect';
import { Token } from '../../../shared/hooks/useJWT';
import { createUser, updatingUser } from '../../../app/slices/userSlice';
import { isUserWithAllAccess } from '../../../shared/helpers/roleHelper';

interface ILoginData {
  username: string;
  password: string;
  role: 'admin' | 'user' | 'root';
  sucursalId?: string | null;
  roles: string[];
}

export interface IRegisterFormProps {
  user?: IUser;
  onClose?: () => void;
}

const RegisterForm = ({ user, onClose }: IRegisterFormProps) => {
  const branches = useAppSelector((state) => state.branches.data);
  const userLogged = useAppSelector((state) => state.auth.signIn.user);
  const roles = useAppSelector((state) => state.roles.roles);

  const dataFilterID = branches.filter(
    (branch) => branch._id === userLogged?.sucursalId?._id
  );

  const [selectedBranch, setSelectedBranch] = useState<{
    nombre: string;
    _id: string;
  } | null>(null);

  const [, setProducts] = useState<ITablaBranch[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  const [credentials, setCredentials] = useState<ILoginData>({
    username: user?.username ?? '',
    password: '',
    role: 'user',
    sucursalId: user?.sucursalId?._id ?? null,
    roles: user?.roles?.map((role) => role._id) ?? [],
  });

  const handleSelectChangeBranch = (value: string) => {
    const branch = branches.find((b) => b._id === value);
    if (branch) {
      setSelectedBranch({ nombre: branch.nombre, _id: branch._id ?? '' });
      setCredentials({
        ...credentials,
        sucursalId: branch._id,
      });
      return;
    }

    setSelectedBranch(null);
    setCredentials({
      ...credentials,
      sucursalId: null,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (user) {
        await store
          .dispatch(
            updatingUser({ user: credentials, id: user._id, token: Token() })
          )
          .unwrap();
      } else {
        await store.dispatch(createUser(credentials)).unwrap();
      }
      onClose && onClose();
      toast.success(
        user
          ? 'Usuario actualizado exitosamente'
          : 'Usuario registrado exitosamente'
      );
      setCredentials({
        username: '',
        password: '',
        role: 'user',
        sucursalId: '',
        roles: [],
      });
      setSelectedBranch(null);
    } catch (error) {
      toast.error(
        user
          ? 'Error al actualizar usuario: ' + error
          : 'Error al registrar usuario: ' + error
      );
    }
  };

  const fetchData = async () => {
    if (!selectedBranch) return;

    const response = await GetBranches(selectedBranch._id);
    setProducts(response);
  };

  useEffect(() => {
    store.dispatch(getRoles()).unwrap();
    store.dispatch(fetchBranches()).unwrap();
    if (selectedBranch) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBranch]);

  const formattedRoles = useMemo(() => {
    return roles.map((role) => ({
      label: role.name,
      value: role._id,
    }));
  }, [roles]);

  const isRootUser = useMemo(() => {
    const roleModels = roles.filter((role) =>
      credentials.roles.includes(role._id)
    );

    return isUserWithAllAccess(roleModels);
  }, [credentials.roles, roles]);

  useEffect(() => {
    if (isRootUser) {
      setSelectedBranch(null);
      setCredentials({
        ...credentials,
        sucursalId: null,
      });

      toast.info(
        'Usuario con todos los permisos, no se requiere seleccionar una sucursal'
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRootUser]);

  const filteredBranche = useMemo(() => {
    if (userLogged?.roles && userLogged?.roles.length === 0) return [];

    return isUserWithAllAccess(userLogged?.roles!) ? branches : dataFilterID;
  }, [branches, dataFilterID, userLogged?.roles]);

  return (
    <>
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 mx-auto mt-10 rounded-lg shadow-md auth-form bg-gray-50 font-onest"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="mb-6 text-2xl font-bold text-center">
          {user ? 'Editar Usuario' : 'Registrar Usuario'}
        </h1>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre de Usuario:
          </label>
          <Input
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="relative mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Contraseña:
          </label>
          <Input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleInputChange}
            required
          />
          <button
            type="button"
            className="absolute right-2 top-[66%] transform -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        <div className="w-full mb-4">
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700"
          >
            Rol:
          </label>

          <MultiSelect
            options={formattedRoles}
            onValueChange={(value) =>
              setCredentials({ ...credentials, roles: value })
            }
            defaultValue={credentials.roles}
            placeholder="Select roles..."
            variant="secondary"
            maxCount={3}
            className="multiselect__roles"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="branch-select"
            className="block text-sm font-medium text-gray-700"
          >
            Sucursal:
          </label>
          <Select
            value={selectedBranch?._id ?? 'none'}
            onValueChange={handleSelectChangeBranch}
            required={!isRootUser}
            disabled={isRootUser}
          >
            <SelectTrigger>
              <SelectValue placeholder="--Selecciona--" />
            </SelectTrigger>
            <SelectContent>
              {isRootUser && (
                <SelectItem key={0} value={'none'} className="text-gray-700">
                  Sin asignar
                </SelectItem>
              )}
              {filteredBranche.map((branch) => (
                <SelectItem key={branch._id} value={branch._id as string}>
                  {branch.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <button
          type="submit"
          className="w-full text-white bg-green-800 hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-400"
          disabled={
            credentials.roles.length === 0 ||
            !credentials.username ||
            !credentials.password ||
            (!isRootUser && !selectedBranch?._id)
          }
        >
          {user ? 'Guardar cambios' : 'Registrar Usuario'}
        </button>
      </motion.form>
    </>
  );
};

export default RegisterForm;
