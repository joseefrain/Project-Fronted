import { IUser } from '../app/slices/login';

export interface IDailyRegister {
  userId: string;
  date: string;
  startWork: string;
  endWork: string;
  hourEntry: string;
  hourExit: string | null;
  lateEntry: boolean;
  note?: string;
}

export interface IRecordedHours {
  userId: string;
  date: Date;
  hourEntry: Date;
  id?: string;
}

export interface IGetRecordedHours {
  startDate: string;
  endDate: string;
  sucursalId: string;
}

export interface IDailyRegisterResponse {
  date: string;
  deleted_at: string | null;
  endWork: string;
  hourEntry: string;
  hourExit: string | null;
  lateEntry: boolean;
  note: string;
  startWork: string;
  userId: IUser;
  _id?: string;
}

export interface IUpdateRecordedHours {
  sucursalId: string;
  endWork: string;
  startWork: string;
}
