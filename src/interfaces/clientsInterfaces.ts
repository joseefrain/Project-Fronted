import { ITablaBranch } from './branchInterfaces';

export interface IClientGeneralInfo {
  identificationNumber: string;
  department: string;
  country: string;
  address: string;
  Name: string;
}

export interface IClientContactInfo {
  email: string;
  mobilePhone: string;
  telephone: string;
}

interface IClientCommercialInfo {
  paymentTerm: string;
  seller: string;
}

interface IClientState {
  amountReceivable: number;
  advancesReceipts: number;
  advancesDelivered: number;
  amountPayable: number;
}

export interface IClient {
  generalInformation: IClientGeneralInfo;
  contactInformation: IClientContactInfo;
  commercialInformation: IClientCommercialInfo;
  state?: IClientState;
  Products?: ITablaBranch[];
  entities: string;
}

//add type and for each branch
