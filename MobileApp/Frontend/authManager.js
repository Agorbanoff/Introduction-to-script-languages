// authManager.js
import * as SecureStore from 'expo-secure-store';
import { BASE_API } from "./apiConfig";
import { getApiErrorMessage, parseApiResponse } from './apiResponse';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

let accessToken = null;

export const setAccessToken = async (token) => {
  accessToken = token;
  if (token) {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  }
};

export const setRefreshToken = async (token) => {
  if (token) {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  }
};

export const storeAuthTokens = async ({ accessToken: nextAccessToken, refreshToken }) => {
  if (refreshToken) {
    await setRefreshToken(refreshToken);
  }

  if (nextAccessToken) {
    await setAccessToken(nextAccessToken);
  }
};

export const getAccessToken = () => accessToken;

export const loadAccessToken = async () => {
  if (accessToken) {
    return accessToken;
  }

  const storedAccessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  if (storedAccessToken) {
    accessToken = storedAccessToken;
  }

  return accessToken;
};

export const ensureAccessToken = async () => {
  const cachedToken = await loadAccessToken();
  if (cachedToken) {
    return cachedToken;
  }

  try {
    return await refreshAccessToken();
  } catch (error) {
    return null;
  }
};

export const clearTokens = async () => {
  accessToken = null;
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
};

export const refreshAccessToken = async () => {
  const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

  if (!refreshToken) throw new Error('No refresh token found');

  const response = await fetch(
    `${BASE_API}/auth/refresh?refresh_token=${encodeURIComponent(refreshToken)}`,
    {
      method: 'POST',
    }
  );

  const data = await parseApiResponse(response);

  if (response.ok && data.access_token) {
    await setAccessToken(data.access_token);
    return data.access_token;
  }

  await clearTokens();
  throw new Error(getApiErrorMessage(data, 'Token refresh failed'));
};
