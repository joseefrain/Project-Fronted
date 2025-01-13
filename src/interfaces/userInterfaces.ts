import { IUser } from '../app/slices/login';

export interface IUserSlice {
  users: IUser[];
  status: string;
  error: string | null;
}

export interface IUserTableProps {
  users: IUser[];
}
