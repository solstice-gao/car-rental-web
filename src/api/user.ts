import axios from 'axios';
import qs from 'query-string';
import { UserState } from '@/store/modules/user/types';

export interface LoginData {
  username: string;
  password: string;
  client: string;
}

export interface LoginRes {
  data: {
    token: string;
    role?: string[]
  }
}



export interface UserInfo {
  data: {
    name: string;
    role?: string[]
  }
}

/**
 * 登录
 */
export function login(data: LoginData) {
  data.client = 'AjJptVdA21lr1cW';
  return axios.post<LoginRes>('/tenant_auth/login', data);
}

/**
 * 检查用户token
 * @param params 
 * @returns 
 */
export function checkUserInfo() {
  return axios.get<UserInfo>('https://bianjietongxun.com/bjtx/api/tcqsk/fstcb/web/check', {
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function logout() {
  // return axios.post<LoginRes>('/api/user/logout');
  return true;
}

export function getUserInfo() {
  return axios.post<UserState>('/user/info');
}
