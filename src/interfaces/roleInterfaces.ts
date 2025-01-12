import { IStatus } from './branchInterfaces';

export interface IRolePrivilege {
  module: string;
  levels: number[];
}

export interface IRole {
  _id: string;
  name: string;
  privileges: IRolePrivilege[];
}

export interface IRoleState {
  roles: IRole[];
  status: IStatus;
  error: string | null;
}

export interface IPageTreeProps {
  selectedPages: IRolePrivilege[];
  readonly?: boolean;
  handleOnChangeModule: (module: string) => void;
  handleOnChangeLevel: (module: string, level: number) => void;
}

export interface IRoleModalProps {
  role: IRole | null;
  readonly?: boolean;
  onSave: (role: IRole) => void;
  onClose: () => void;
}

export interface IRoleTableProps {
  roles: IRole[];
}
