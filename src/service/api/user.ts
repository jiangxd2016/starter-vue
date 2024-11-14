import { request } from '../request';

interface LoginData {
  username: string;
  password: string;
}

interface LoginRes {
  access_token: string;
  name: string;
}
export function login(data: LoginData) {
  return request.post<LoginRes>('/api/authentication/user/login/', data);
}

export function getUserInfo() {
  return request.post<any>('/api/user/info');
}

export function logout() {
  return request.post('/api/authentication/user/logout/');
}
