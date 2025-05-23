import { getAccessToken, refreshAccessToken } from './authManager';

export const authFetch = async (url, options = {}, retry = true) => {
  const token = getAccessToken();

  options.headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  const res = await fetch(url, options);

  if (res.status === 401 && retry) {
    try {
      const newToken = await refreshAccessToken();
      options.headers.Authorization = `Bearer ${newToken}`;
      return await fetch(url, options); // retry once
    } catch (e) {
      throw e;
    }
  }

  return res;
};
