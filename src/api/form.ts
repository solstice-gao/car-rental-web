import axios from 'axios';

export interface BaseInfoModel {
  carDesc: string;
  companyId: string;
  carDescTitle: string;
  carSendFrom: string;
  carSendMarktext: string;
  price: number;
  adress?:any[];
}
export interface Price {
  carPrice: number;
  carInsuranceFee: number;
  carBatteryFee: number;
  carProcessingFee: number;
  carInitialFee: number;
}
export interface RentalCarAddress {
  addressId?: string;
  carId?: string;
  userName: string;
  phone: string;
  seqNumber?: number | null;
  province: string;
  city: string;
  county: string;
  street: string;
  createTime?: Date | null;
  updateTime?: Date | null;
}
export interface ChannelInfoModel {
  colors?: string[],
  models?: string[],
  prices: Price[],
}

export interface CarInfo {
  carId: string;
}

export type UnitChannelModel = BaseInfoModel & ChannelInfoModel;

export function submitChannelForm(data: UnitChannelModel) {
  return axios.post('/channel-form/submit', { data });
}

export function getCompanyList() {
  return axios.post('/rentalCompany/queryAllByAdmin');
}

export function addColorModels(data: UnitChannelModel) {
  return axios.post('/rentalCarModels/addColorModels', data);
}

export function putShelves(data: CarInfo) {
  return axios.post('/rentalCars/putShelves/' + data.carId);
}
