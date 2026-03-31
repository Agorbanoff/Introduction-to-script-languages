export const parseApiResponse = async (response) => {
  const raw = await response.text();

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
};

export const getApiErrorMessage = (
  payload,
  fallback = 'Something went wrong.'
) => {
  if (!payload) {
    return fallback;
  }

  if (typeof payload === 'string') {
    return payload;
  }

  if (Array.isArray(payload.detail)) {
    return payload.detail
      .map((item) => item?.msg || item?.detail || String(item))
      .join('\n');
  }

  if (typeof payload.detail === 'string') {
    return payload.detail;
  }

  if (typeof payload.message === 'string') {
    return payload.message;
  }

  return fallback;
};
