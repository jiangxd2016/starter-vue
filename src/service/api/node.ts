import { request } from '../request';

export function saveConfig(data) {
  return request.post('/api/config/node/', data);
}
