import { IStatus, ITablaBranch } from './branchInterfaces';

export interface IEntitiesGeneralInfo {
  identificationNumber: string;
  department: string;
  country: string;
  address: string;
  name: string;
}

export interface IEntitiesContactInfo {
  email: string;
  mobilePhone: string;
  telephone: string;
}

interface IEntitiesCommercialInfo {
  paymentTerm: string;
  seller: string;
}

interface IEntitiesState {
  amountReceivable: number;
  advancesReceipts: number;
  advancesDelivered: number;
  amountPayable: number;
}

export interface IEntities {
  generalInformation: IEntitiesGeneralInfo;
  contactInformation: IEntitiesContactInfo;
  commercialInformation: IEntitiesCommercialInfo;
  state?: IEntitiesState;
  Products?: ITablaBranch[];
  entities: string;
  type: IEntityType;
}

export type IEntityType = 'customer' | 'supplier';

export interface entitiesState {
  data: IEntities[];
  selectedEntity: IEntities | null;
  status: IStatus;
  error: string | null;
  loading: boolean;
}
