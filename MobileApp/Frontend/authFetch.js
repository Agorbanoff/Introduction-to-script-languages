import { ensureAccessToken, refreshAccessToken } from './authManager';

export const authFetch = async (url, options = {}, retry = true) => {
  const token = await ensureAccessToken();
  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const requestOptions = {
    ...options,
    headers,
  };

  const res = await fetch(url, requestOptions);

  if (res.status === 401 && retry) {
    try {
      const newToken = await refreshAccessToken();
      return authFetch(
        url,
        {
          ...options,
          headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${newToken}`,
          },
        },
        false
      );
    } catch {
      return res;
    }
  }

  return res;
};
