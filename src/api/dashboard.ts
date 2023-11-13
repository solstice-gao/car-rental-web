import axios from 'axios';



export interface commitDataResp {
  data: [{
    channel: string, // 渠道
    product: string, // 套餐
    status: number, // 状态
    t: string,
    cnt: string
  }]

}


export function queryCommitData(params?: { startTime?: string, endTime?: string }) {
  return axios.get<commitDataResp>('https://bianjietongxun.com/bjtx/api/tcqsk/fstcb/web/order/statistics', { params });
}



export interface ContentDataRecord {
  x: string;
  y: number;
}

export function queryContentData() {
  return axios.get<ContentDataRecord[]>('/content-data');
}

export interface PopularRecord {
  key: number;
  clickNumber: string;
  title: string;
  increases: number;
}

export function queryPopularList(params: { type: string }) {
  return axios.get<PopularRecord[]>('/popular/list', { params });
}
