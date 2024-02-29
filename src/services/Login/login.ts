// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

export async function RefreshCaptchaApi() {
  return request(`/auth/captcha`, {
    method: 'POST',
  });
}
