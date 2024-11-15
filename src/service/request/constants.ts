export const REFRESH_TOKEN_CODE = 401;
export const TOKEN_MISSING_CODE = 403;

export const PAGE_NOT_FOUND_CODE = 404;

export const REQUEST_ERROR_CODE: (string | number)[] = [400, 401, 403, 404, 500, 502, 503, 504];
export const REQUEST_ERROR_MSG: { [key: string]: string } = {
  400: '请求错误',
  401: '未授权，请登录',
  403: '拒绝访问',
  404: `请求地址出错: ${location.href}`,
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
};

export const BASE_REQUEST_PATH = import.meta.env.MODE === 'development' ? '/' : '/';

export const BASE_IMG_PATH = import.meta.env.MODE === 'development' ? '/dev-api' : '';
