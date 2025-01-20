import { useAppSelector } from '@/app/hooks';
import { fetchBranches } from '@/app/slices/branchSlice';
import { IUser, updateSignIn } from '@/app/slices/login';
import { store } from '@/app/store';
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
import { UNIQUE_ROLES } from '../../../shared/helpers/roleHelper';
import { ROLE } from '../../../interfaces/roleInterfaces';

interface ILoginData {
  username: string;
  password: string;
  role: ROLE;
  sucursalId?: string | null;
  roles: string[];
}

export interface IRegisterFormProps {
  user?: IUser;
  onClose?: () => void;
}

const RegisterForm = ({ user, onClose }: IRegisterFormProps) => {
  const branches = useAppSelector((state) => state.branches.data);
  const { user: userLogged, cajaId } = useAppSelector(
    (state) => state.auth.signIn
  );
  const roles = useAppSelector((state) => state.roles.roles);

  const branchesAllowed = useMemo(() => {
    const branchAssigned = branches.filter(
      (branch) => branch._id === userLogged?.sucursalId?._id
    );

    return userLogged?.role?.toUpperCase() === ROLE.ROOT
      ? branches
      : branchAssigned;
  }, [branches, userLogged]);

  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState<ILoginData>({
    username: user?.username ?? '',
    password: '',
    role: user?.role ?? ROLE.EMPLEADO,
    sucursalId: user?.sucursalId?._id ?? null,
    roles: user?.roles?.map((role) => role._id) ?? [],
  });

  const handleSelectChangeBranch = (value: string) => {
    setCredentials({
      ...credentials,
      sucursalId: value,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeUniqueRole = (value: string) => {
    console.log(value);

    if (value === ROLE.ROOT) {
      const rootPrivilege = roles.find(
        (role) => role.name.toUpperCase() === ROLE.ROOT
      );
      setCredentials({
        ...credentials,
        sucursalId: '',
        role: value as ROLE,
        roles: [rootPrivilege?._id!],
      });

      toast.info(
        'Usuario con todos los permisos, no se requiere seleccionar una sucursal'
      );

      return;
    }

    setCredentials({
      ...credentials,
      role: value as ROLE,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (user) {
        await store
          .dispatch(
            updatingUser({
              user: {
                ...credentials,
                sucursalId:
                  credentials.sucursalId === '' ? null : credentials.sucursalId,
              },
              id: user._id,
              token: Token(),
            })
          )
          .unwrap()
          .then((res) => {
            if (userLogged?._id === res.data._id) {
              store.dispatch(
                updateSignIn({
                  token: res.token,
                  user: res.data,
                  cajaId: cajaId,
                })
              );
            }
          });
      } else {
        await store
          .dispatch(
            createUser({
              ...credentials,
              sucursalId:
                credentials.sucursalId === '' ? null : credentials.sucursalId,
            })
          )
          .unwrap();
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
        role: ROLE.EMPLEADO,
        sucursalId: '',
        roles: [],
      });
    } catch (error) {
      toast.error(
        user
          ? 'Error al actualizar usuario: ' + error
          : 'Error al registrar usuario: ' + error
      );
    }
  };

  const formattedRoles = useMemo(() => {
    return roles.map((role) => ({
      label: role.name,
      value: role._id,
    }));
  }, [roles]);

  useEffect(() => {
    store.dispatch(getRoles()).unwrap();
    store.dispatch(fetchBranches()).unwrap();
  }, []);

  return (
    <>
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 mx-auto mt-10 rounded-lg shadow-md auth-form bg-gray-50 font-onest dark:bg-gray-950"
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

        <div className="mb-4">
          <label
            htmlFor="branch-select"
            className="block text-sm font-medium text-gray-700"
          >
            Rol:
          </label>
          <Select
            value={credentials.role}
            onValueChange={(value) => handleChangeUniqueRole(value as string)}
            required={credentials.role !== ROLE.ROOT}
          >
            <SelectTrigger>
              <SelectValue placeholder="--Selecciona--" />
            </SelectTrigger>
            <SelectContent>
              {UNIQUE_ROLES.map((role) => (
                <SelectItem key={role.value} value={role.value?.toString()}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full mb-4">
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700"
          >
            Privilegios:
          </label>

          <MultiSelect
            options={formattedRoles}
            onValueChange={(value) =>
              setCredentials({ ...credentials, roles: value })
            }
            placeholder="Selecciona los privilegios..."
            variant="secondary"
            maxCount={3}
            defaultValue={credentials.roles}
            value={credentials.roles}
            disabled={credentials.role === ROLE.ROOT}
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
            value={credentials.sucursalId ?? 'none'}
            onValueChange={handleSelectChangeBranch}
            required={credentials.role !== ROLE.ROOT}
            disabled={credentials.role === ROLE.ROOT}
          >
            <SelectTrigger>
              <SelectValue placeholder="--Selecciona--" />
            </SelectTrigger>
            <SelectContent>
              {branchesAllowed.map((branch) => (
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
            (credentials.role !== ROLE.ROOT && !credentials.sucursalId)
          }
        >
          {user ? 'Guardar cambios' : 'Registrar Usuario'}
        </button>
      </motion.form>
    </>
  );
};

export default RegisterForm;
