import { BASE_REQUEST_PATH } from './constants';
import { createRequest } from './request';

// const { VITE_BASE_API } = import.meta.env;

export const request = createRequest({ baseURL: BASE_REQUEST_PATH });

export const requestWorkFlow = createRequest({ baseURL: '' });
