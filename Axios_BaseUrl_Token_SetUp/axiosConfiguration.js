import axios from 'axios';
import { getToken } from './getToken';

export const baseURL = 'https://yatrisubidha.wb.gov.in/service/';

const axiosConfiguration = axios.create({
  baseURL,
  timeout: 15000, // prevent endless waiting
  headers: {
    Accept: "application/json",
    Connection: "keep-alive", // ✅ faster SSL reuse
  }
});

// Endpoints where token must NOT be added
const noAuthEndpoints = [
  'GenerateAuthTokenV1',
  'GenerateAuthTokenV2',
  '/user/send-login-otp',
  '/user/verify-login-otp',
];

axiosConfiguration.interceptors.request.use(
  async (config) => {
    try {
      const endpoint = config.url.replace(baseURL, "").replace(/^\//, "");
      
      if (!noAuthEndpoints.includes(endpoint)) {
        const token = await getToken();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          // console.log("Bearer Token Attached ✅");
        }
      } else {
        // Important: remove token for unauthenticated requests
        delete config.headers.Authorization;
        console.log("Token removed for:", endpoint);
      }

      // ✅ If FormData is sent → do not override Content-Type
      if (!(config.data instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
      }

    } catch (error) {
      console.error("Interceptor Token Error:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosConfiguration;
