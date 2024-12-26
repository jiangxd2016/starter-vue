import { ref } from 'vue';
import type { Ref } from 'vue';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { BackendResultConfig } from './instance';
import CustomAxiosInstance from './instance';
import { useBoolean, useLoading } from '@//hooks';
import { parseParams } from '@//utils';

type RequestMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

interface RequestParam {
  url: string;
  method?: RequestMethod;
  data?: any;
  axiosConfig?: AxiosRequestConfig;
}
/** 自定义的请求成功结果 */
export interface SuccessResult<T = any> {
  /** 请求错误 */
  error: any;
  /** 请求数据 */
  data: T;
  code: number;
  statusText: string;

  count?: number;
}

/** 自定义的请求失败结果 */
export interface FailedResult<T = any> {
  /** 请求错误 */
  error: any;
  /** 请求数据 */
  data: any;
  code: number;
  statusText: string;
}
/** 自定义的请求结果 */
export type RequestResult<T = any> = SuccessResult<T> & FailedResult;

/**
 * 创建请求
 * @param axiosConfig - axios配置
 * @param backendConfig - 后端接口字段配置
 */
export function createRequest(
  axiosConfig: AxiosRequestConfig,
  backendConfig?: BackendResultConfig,
) {
  const customInstance = new CustomAxiosInstance(axiosConfig, backendConfig);

  /**
   * 异步promise请求
   * @param param - 请求参数
   * - url: 请求地址
   * - method: 请求方法(默认get)
   * - data: 请求的body的data
   * - axiosConfig: axios配置
   */
  async function asyncRequest<T>(param: RequestParam): Promise<RequestResult<T>> {
    const { url } = param;
    const method = param.method || 'get';
    const { instance } = customInstance;
    if (method === 'delete') {
      param.data = JSON.stringify(param.data);
    }
    const res = (await getRequestResponse({
      instance,
      method,
      url: param.axiosConfig?.baseURL ? param.axiosConfig?.baseURL + url : url,
      data: param.data,
      config: param.axiosConfig,
    })) as RequestResult<T>;

    return res;
  }

  /**
   * get请求
   * @param url - 请求地址
   * @param config - axios配置
   */
  function get<T>(url: string, data: any = undefined, config?: AxiosRequestConfig) {
    return asyncRequest<T>({ url, method: 'get', data, axiosConfig: config });
  }

  /**
   * post请求
   * @param url - 请求地址
   * @param data - 请求的body的data
   * @param config - axios配置
   */
  function post<T>(url: string, data: any = {}, config?: AxiosRequestConfig) {
    return asyncRequest<T>({ url, method: 'post', data, axiosConfig: config });
  }
  /**
   * put请求
   * @param url - 请求地址
   * @param data - 请求的body的data
   * @param config - axios配置
   */
  function put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return asyncRequest<T>({ url, method: 'put', data, axiosConfig: config });
  }

  /**
   * delete请求
   * @param url - 请求地址
   * @param config - axios配置
   */
  function handleDelete<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return asyncRequest<T>({
      url,
      method: 'delete',
      data,
      axiosConfig: config,
    });
  }

  function patch<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return asyncRequest<T>({
      url,
      method: 'patch',
      data,
      axiosConfig: config,
    });
  }

  return {
    get,
    post,
    put,
    delete: handleDelete,
    patch,
  };
}

interface RequestResultHook<T = any> {
  data: Ref<T | null>;
  error: Ref<any | null>;
  loading: Ref<boolean>;
  network: Ref<boolean>;
}

/**
 * 创建hooks请求
 * @param axiosConfig - axios配置
 * @param backendConfig - 后端接口字段配置
 */
export function createHookRequest(
  axiosConfig: AxiosRequestConfig,
  backendConfig?: BackendResultConfig,
) {
  const customInstance = new CustomAxiosInstance(axiosConfig, backendConfig);

  /**
   * hooks请求
   * @param param - 请求参数
   * - url: 请求地址
   * - method: 请求方法(默认get)
   * - data: 请求的body的data
   * - axiosConfig: axios配置
   */
  function useRequest<T>(param: RequestParam): RequestResultHook<T> {
    const { loading, startLoading, endLoading } = useLoading();
    const { bool: network, setBool: setNetwork } = useBoolean(window.navigator.onLine);

    startLoading();
    const data = ref<T | null>(null) as Ref<T | null>;
    const error = ref<any | null>(null);

    function handleRequestResult(response: any) {
      const res = response as RequestResult<T>;
      data.value = res.data;
      error.value = res.error;
      endLoading();
      setNetwork(window.navigator.onLine);
    }

    const { url } = param;
    const method = param.method || 'get';
    const { instance } = customInstance;

    getRequestResponse({
      instance,
      method,
      url,
      data: param.data,
      config: param.axiosConfig,
    }).then(handleRequestResult);

    return {
      data,
      error,
      loading,
      network,
    };
  }

  /**
   * get请求
   * @param url - 请求地址
   * @param config - axios配置
   */
  function get<T>(url: string, config?: AxiosRequestConfig) {
    return useRequest<T>({ url, method: 'get', axiosConfig: config });
  }

  /**
   * post请求
   * @param url - 请求地址
   * @param data - 请求的body的data
   * @param config - axios配置
   */
  function post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return useRequest<T>({ url, method: 'post', data, axiosConfig: config });
  }
  /**
   * put请求
   * @param url - 请求地址
   * @param data - 请求的body的data
   * @param config - axios配置
   */
  function put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return useRequest<T>({ url, method: 'put', data, axiosConfig: config });
  }

  /**
   * delete请求
   * @param url - 请求地址
   * @param config - axios配置
   */
  function handleDelete<T>(url: string, config: AxiosRequestConfig) {
    return useRequest<T>({ url, method: 'delete', axiosConfig: config });
  }

  return {
    get,
    post,
    put,
    delete: handleDelete,
  };
}

async function getRequestResponse(params: {
  instance: AxiosInstance;
  method: RequestMethod;
  url: string;
  data?: any;
  config?: AxiosRequestConfig;
}) {
  const { instance, method, url, data, config } = params;

  let res: any;
  const customConfig = config || {};

  if (method === 'get' || method === 'delete') {
    const urls = url + (data ? `?${parseParams(data)}` : '');
    res = await instance[method](urls, customConfig);
  } else {
    res = await instance[method](url, data, customConfig);
  }
  return res;
}
