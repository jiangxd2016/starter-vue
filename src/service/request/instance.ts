import axios from 'axios';
import { Modal } from '@arco-design/web-vue';
import { isPlainObject } from 'lodash-es';
import router from '@/router';
import { useToken } from '@/hooks';
import {
  PAGE_NOT_FOUND_CODE,
  REFRESH_TOKEN_CODE,
  REQUEST_ERROR_MSG,
  TOKEN_MISSING_CODE,
} from './constants';
import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

/** 后端接口返回的数据结构配置 */
export interface BackendResultConfig {
  /** 表示后端请求状态码的属性字段 */
  codeKey: string;
  /** 表示后端请求数据的属性字段 */
  dataKey: string;
  /** 表示后端消息的属性字段 */
  msgKey: string;
  /** 后端业务上定义的成功请求的状态 */
  successCode: number | string;
}

export default class CustomAxiosInstance {
  instance: AxiosInstance;

  backendConfig: BackendResultConfig;

  /**
   *
   * @param axiosConfig - axios配置
   * @param backendConfig - 后端返回的数据配置
   */
  constructor(
    axiosConfig: AxiosRequestConfig,
    backendConfig: BackendResultConfig = {
      codeKey: 'status',
      dataKey: 'data',
      msgKey: 'msg',
      successCode: 200,
    },
  ) {
    this.backendConfig = backendConfig;
    this.instance = axios.create(axiosConfig);
    this.setInterceptor();
  }

  /** 设置请求拦截器 */
  setInterceptor() {
    this.instance.interceptors.request.use(async config => {
      const tk = useToken.get('token');
      if (tk) {
        config.headers.token = tk;
        config.headers['Cache-Control'] = 'no-cache';
      }
      return config;
    });
    this.instance.interceptors.response.use(
      async (response): Promise<any> => {
        const { status } = response;
        if (status === 200 || status < 300 || status === 304) {
          const backend = response as any;
          const { codeKey, dataKey, successCode, msgKey } = this.backendConfig;

          // 请求成功
          if (backend[codeKey] === successCode) {
            if (backend[dataKey]?.code === 200) {
              return backend[dataKey];
            }
            return {
              status,
              code: backend[codeKey],
              statusText: backend[msgKey] as string,
              data: backend[dataKey] as any,
            };
          }

          return {
            status,
            code: backend[codeKey],
            statusText: backend[msgKey] as string,
            data: null,
          };
        }
        // const error = handleResponseError(response);
        // return handleServiceResult(error, null);
      },
      async (error: AxiosError) => {
        const { status } = error.response || {};
        if (status === TOKEN_MISSING_CODE) {
          useToken.clear();
          router.push({
            name: 'login',
          });
          return;
        }

        const handleRefreshToken = async (config: AxiosRequestConfig) => {
          const { data } = await this.instance.post('/authentication/userRefresh/', {
            refresh_token: localStorage.getItem('refreshToken'),
          });
          if (data.code === 0) {
            localStorage.setItem('token', data?.access_token);
            if (config.headers) {
              config.headers.token = data?.access_token;
            }
            return config;
          } else {
            Modal.confirm({
              title: '登录失效',
              content: '登录失效，请重新登录',
              onOk: () => {
                window.location.href = '/login';
              },
            });
          }
        };
        if (REFRESH_TOKEN_CODE === status && error.config && useToken.get('refreshToken')) {
          useToken.clear();
          const config = await handleRefreshToken(error.config);
          if (config) {
            return this.instance.request(config);
          }
        }

        if (status === REFRESH_TOKEN_CODE) {
          useToken.remove();
          Modal.confirm({
            title: '登录失效',
            content: REQUEST_ERROR_MSG[status],
            onOk: () => {
              window.location.reload();
            },
          });
        } else {
          const errorData = error.response?.data;
          let errorMessage = isPlainObject(errorData)
            ? Object.values(errorData as object)[0]
            : errorData;

          // 404的错误会有很长的字符报错，直接屏蔽掉
          if (error.response?.status === PAGE_NOT_FOUND_CODE) {
            errorMessage = error.message;
          }

          // Message.error({
          //   content: error?.message || 'Request Error',
          //   duration: 5 * 1000,
          // });
          return Promise.reject(error);
        }
      },
    );
  }
}
