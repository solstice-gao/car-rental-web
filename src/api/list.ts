import axios from 'axios';
import qs from 'query-string';
import { Options } from '@/types/global';
import * as XLSX from 'xlsx';

export interface PolicyRecord {
  companyId: string;
  addressId: string;
  companyName: string;
  companyCity: string;
  companyMonthlySales: string;
  companyIcon: string;
  createdTime: string;
  updatedTime: string;
}


export interface ResGroupByCompany {
  companyId: string;
  addressId: string;
  companyName: string;
  companyCity: string;
  companyMonthlySales: string;
  companyIcon: string;
  businessLicense: string;
  carList: RentalCars[];
}

export interface RentalCars {
  carId: string;
  carDesc: string;
  modelId: string;
  companyId: string;
  storeId: string;
  price: number;
  carDescTitle: string;
  carSendFrom: string;
  carSendMarktext: string;
  carImageId: string;
  carImageDescId: string;
  discount: string;
  licensePlate: string;
  status: number;
  imageUrl: string;
  createdTime: Date;
}



export interface OrderRecord {
  orderId: string;
  orderNo: string;
  otherOrderId: string;
  link: string;
  userId: string;
  carId: string;
  modelId: string;
  companyId: string;
  addressId: string;
  couponId: string;
  totalPrice: number;
  couponPrice: number;
  payablePrice: number;
  payMethod: string;
  invoiceTplId: string;
  leaveComment: string;
  orderStatus: number;
  createdTime: Date;
  updatedTime: Date;
}


export interface PolicyCommitRecord {
  time: string;
  status: number;
  age: string;
  deliveryAddress: string;
  deliveryAddressDetail: string;
  deliveryName: string;
  deliveryPhone: string;
  chooseNumber: string;
  chooseNumberProvince: string;
  chooseNumberCity: string;
  idCardNumber: string;
  touchCode: string;
  productCode: string;
  orderId: string;
  authId: string;
  shipmentRecords: ShipmentRecords;
  changeList: ChangeList[];
}


export interface ShipmentRecords {
  com: string;
  data: {
    ftime: string;
    context: string;
    time: string;
  }[];
}

export interface ChangeList {
  time: string;
  status: number
}

export interface PolicyParams extends Partial<PolicyRecord> {
  s?: string;
  status?: number;
  startTime?: string;
  endTime?: string;
  page: number;
  size: number;
}

export interface ResRentalCarousel {
  city: string,
  rentalCarousels: RentalCarousels[]
}

export interface RentalCarousels {
  carouselId: string;
  showCity: string;
  imageUrl: string;
  status: string;
}



export interface CommitParams {
  id: string
}


export interface PolicyListRes {
  data: PolicyRecord[];
  total: number;
}

export interface UpdateStatusRes {
  data: number;
}

export interface PolicyCommitRes {
  data: PolicyCommitRecord;
  total: number;
}

/**
 * 查询列表
 * @param params 
 * @returns 
 */
export function queryPolicyList(params: PolicyParams) {
  return axios.get<PolicyListRes>('/rentalCompany', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}



/**
 * 删除订单
 * @param params 
 * @returns 
 */
export function deleteOrderById(orderId: string) {
  return axios.delete<PolicyListRes>('/rentalOrder/del?orderId=' + orderId, {
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}


/**
 * 删除优惠券
 * @param params 
 * @returns 
 */
export function deleteCouponById(orderId: string) {
  return axios.post<PolicyListRes>('/rentalCoupons/delete/' + orderId, {
    paramsSerializer: (obj: Record<string, any>) => {
      return qs.stringify(obj);
    },
  });
}

/**
 * 更新订单状态
 * @param orderId 
 * @param status 
 * @returns 
 */
export function updateStatusOrderById(orderNo: string, status: number) {
  return axios.post<UpdateStatusRes>('/rentalOrder/updateOrderStatus', {
    orderId: orderNo, orderStatus: status,
    paramsSerializer: (obj: Record<string, any>) => {
      return qs.stringify(obj);
    },
  });
}

/**
 * 查询提交详情
 * @param params 
 * @returns 
 */
export function getCommitInfo(params: CommitParams) {
  return axios.get<PolicyCommitRes>('/rentalOrder/del', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}



export interface ServiceRecord {

  carId: string;
  carDesc: string;
  carDescTitle: string;
  carSendFrom?: string;
  carSendMarktext?: string;
  imageUrl?: string;
}


export function downloadXlsxFile(renderData: any) {
  const statusMap: any = {
    '0': '待处理',
    '1': '已完成',
    '-1': '提交失败',
    '-2': '已取消',
  }

  const progressMap: any = {
    '0': '订单提交',
    '100': '初始状态',
    '200': '待支付',
    '201': '支付中',
    '202': '支付成功',
    '203': '支付失败',
    '300': '待订购',
    '301': '订购中',
    '302': '订购成功',
    '303': '订购失败',
    '304': '订购待重试',
    '1000': '待商户确认',
    '1005': '预处理成功',
    '1010': '预处理失败',
    '1015': '备货中',
    '1020': '已发货',
    '1025': '订购完成',
    '1030': '订购失败',
    '1035': '已激活',
    '1040': '激活失败',
    '20': '异步收单下单失败',
  }

  const data = renderData.map((item: any, index: number) => {
    const changeItem = (item.changeList || [])[0] || {}

    return {
      "序号": index + 1,
      "时间": item.time,
      "订单状态": statusMap[item.status] || item.status,
      "激活状态": item.activate == 1 ? '已激活' : '未激活',
      "激活进度": progressMap[changeItem] || '暂无',
      "充值状态": item.recharge == 1 ? '已充值' : '未充值',
      "年龄": item.age,
      "送货地址": item.deliveryAddress,
      "详细地址": item.deliveryAddressDetail,
      "姓名": item.deliveryName,
      "电话": item.deliveryPhone,
      "选择号码": item.chooseNumber,
      "选择号码省份": item.chooseNumberProvince,
      "选择号码城市": item.chooseNumberCity,
      "身份证号码": item.idCardNumber,
      "触点编码": item.touchCode,
      "产品编码": item.productCode,
      "订单号": item.orderId,
      "认证号": item.authId,
      "渠道": item.channel,
      "提交结果": item.submitMessage,
    };
  });
  // const data = renderData.value;
  // Create a new workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);

  const columnWidths = [
    { wch: 5 },   // Column A width (序号)
    { wch: 20 },  // Column B width (时间)
    { wch: 10 },  // Column C width (订单状态)
    { wch: 10 },  // Column C width (激活状态)
    { wch: 10 },  // Column C width (充值状态)
    { wch: 10 },  // Column D width (年龄)
    { wch: 25 },  // Column E width (送货地址)
    { wch: 20 },  // Column F width (详细地址)
    { wch: 10 },  // Column G width (姓名)
    { wch: 15 },  // Column H width (电话)
    { wch: 15 },  // Column I width (选择号码)
    { wch: 15 },  // Column J width (选择号码省份)
    { wch: 15 },  // Column K width (选择号码城市)
    { wch: 15 },  // Column L width (身份证号码)
    { wch: 15 },  // Column M width (触点编码)
    { wch: 15 },  // Column N width (产品编码)
    { wch: 20 },  // Column O width (订单号)
    { wch: 20 },  // Column P width (认证号)
    { wch: 15 },  // Column Q width (渠道)
    { wch: 30 },  // Column R width (提交结果)
  ];

  worksheet['!cols'] = columnWidths;

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Generate an XLSX file and create a Blob object
  const xlsxFile = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
  const blob = new Blob([xlsxFile], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  // Create a download link
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `骑士卡订单数据_${Date.now()}.xlsx`;
  document.body.appendChild(a);

  // Programmatically trigger the download
  a.click();

  // Cleanup: remove the download link
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}


export function queryGroupByCompany(status:any) {
  return axios.get('/rentalCars/queryGroupByCompany?status='+status);
}

export function offTheShelf(status:number, carId: string) {
  return axios.get('/rentalCars/offTheShelf?carId=' + carId+'&status='+status);
}

export function queryCarouselGroupByCity(status: number) {
  return axios.get('/rentalCarousel/queryAll?status=' + status);
}

export function queryTheServiceList() {
  return axios.get('/list/the-service');
}

export function queryRulesPresetList() {
  return axios.get('/list/rules-preset');
}

export interface OrderParams extends PolicyRecord{
  s?: string;
  status?: number;
  startTime?: string;
  endTime?: string;
  page: number;
  size: number;
}

export interface CouponParams {
  s?: string;
  status?: number;
  startTime?: string;
  endTime?: string;
  page: number;
  size: number;
  rentalOrder: PolicyRecord
}

export function queryCouponList(params: CouponParams) {
  console.log(params);
  
  return axios.post('/rentalCoupons?page=' + params.page, {
    ...params,
    paramsSerializer: (obj: Record<string, any>) => {
      return qs.stringify(obj);
    },
  });
}

export function queryOrdersPresetList(params: OrderParams) {
  return axios.post('/rentalOrder/getOrdersAdmin?page='+params.page, {
    ...params,
    paramsSerializer: (obj: Record<string, any>) => {
      return qs.stringify(obj);
    },
  });
}


export function updateCompany(params: PolicyRecord) {
  return axios.post('/rentalCompany/update', {
    ...params,
    paramsSerializer: (obj: Record<string, any>) => {
      return qs.stringify(obj);
    },
  });
}

export function addCompany(params: PolicyRecord) {
  return axios.post('/tenant_company/add', {
    ...params,
    paramsSerializer: (obj: Record<string, any>) => {
      return qs.stringify(obj);
    },
  });
}

export interface CouponRecord {
    couponCode: string;
    title: string;
    description: string;
    discountType: string;
    discountValue: number;
    minimumPurchase: number;
    maximumDiscount: number;
    startDate: number;
    endDate: number;
}


export function addCoupon(params: CouponRecord) {
  return axios.post('/rentalCoupons/add', {
    ...params,
    paramsSerializer: (obj: Record<string, any>) => {
      return qs.stringify(obj);
    },
  });
}

export function deleteCompanyById(companyId: string) {
  return axios.post('/rentalCompany/delete/'+companyId, {
    paramsSerializer: (obj: Record<string, any>) => {
      return qs.stringify(obj);
    },
  });
}

