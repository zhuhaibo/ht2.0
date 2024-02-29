import { isBlank } from '@/utils/utils';
import { history } from '@@/core/history';

const cryptoKey = ')(*&^%$#@!1234567890!@#$%^&*()';
const CryptoJS = (await import('crypto-js')).default;

const setLocalStorageItem = (key: string, rawData: any) => {
  const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(rawData), cryptoKey).toString();
  localStorage.setItem(key, encryptedData);
};

const getLocalStorageItem = (key: string): any | undefined => {
  const encryptedData = localStorage.getItem(key);
  if (isBlank(encryptedData)) return undefined;
  return JSON.parse(CryptoJS.AES.decrypt(encryptedData!!, cryptoKey).toString(CryptoJS.enc.Utf8));
};

const toLogin = (timeout: number = 500) => {
  localStorage.removeItem('token');
  setTimeout(() => {
    if (window.location.href.indexOf('/login') === -1) {
      window.location.href = `/login?redirect=${encodeURIComponent(history.location.pathname)}`;
    }
  }, timeout);
};

const setToken = (token: string) => setLocalStorageItem('token', token);

const getToken = (): string => {
  const token = getLocalStorageItem('token');
  if (isBlank(token)) {
    toLogin();
    return '';
  }
  return token as string;
};

export { getLocalStorageItem, getToken, setLocalStorageItem, setToken, toLogin };
