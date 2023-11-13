import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message, Modal } from '@arco-design/web-vue';
import { useUserStore } from '@/store';
import router from '@/router';
import { getClient, getToken } from '@/utils/auth';


export interface HttpResponse<T = unknown> {
  status: number;
  message: string;
  code: number;
  data: T;
}

// export const HOST = 'https://bianjietongxun.com/hzwl-rental'
export const HOST = 'http://localhost:9999/hzwl-rental'

axios.defaults.baseURL = HOST

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (config.headers) {
	  let _token = getToken()
      config.headers.client = getClient();
      config.headers.authentication = _token; // ?
      config.headers.satoken = _token;
    }
    return config;
  },
  (error) => {
    // do something
    return Promise.reject(error);
  }
);
// add response interceptors
axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    const res = response.data;
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      Message.error({
        content: res.message || 'Error',
        duration: 5 * 1000,
      });

      if (res.code === 403) {
        // 使用 router 导航到登录界面
        router.push({
          name: 'login', // 登录页面的路由名称，请根据实际情况修改
        });
      }

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (
        [50008, 50012, 50014].includes(res.code) &&
        response.config.url !== '/user/info'
      ) {
        Modal.error({
          title: 'Confirm logout',
          content:
            'You have been logged out, you can cancel to stay on this page, or log in again',
          okText: 'Re-Login',
          async onOk() {
            const userStore = useUserStore();

            await userStore.logout();
            window.location.reload();
          },
        });
      }
      return Promise.reject(new Error(res.message || 'Error'));
    }
    return response;
  },
  (error) => {
    Message.error({
      content: error.message,
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);
