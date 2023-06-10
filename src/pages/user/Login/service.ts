import { request } from 'umi';

export async function getPhoneCaptcha(phone: string) {
  const result = request('/api/system/loginCenter/sendSMS', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      checkOccasion: 1,
      phoneNumber: phone,
    }),
  });
  return result;
}
