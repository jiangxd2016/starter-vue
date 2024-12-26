const TOKEN_KEY = 'token';

const useToken = {
  get: (key: string = TOKEN_KEY) => localStorage.getItem(key),
  set: (value: string, key: string = TOKEN_KEY) => localStorage.setItem(key, value),
  remove: (key: string = TOKEN_KEY) => localStorage.removeItem(key),
  clear: () => localStorage.clear(),
};
export default useToken;
