// authManager.js
import * as SecureStore from 'expo-secure-store';

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const clearTokens = async () => {
  accessToken = null;
  await SecureStore.deleteItemAsync('refresh_token');
};

export const refreshAccessToken = async () => {
  const refreshToken = await SecureStore.getItemAsync('refresh_token');

  if (!refreshToken) throw new Error('No refresh token found');

  const response = await fetch('https://gymax.onrender.com/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const data = await response.json();

  if (response.ok && data.access_token) {
    setAccessToken(data.access_token);
    return data.access_token;
  }

  await clearTokens();
  throw new Error('Token refresh failed');
};
