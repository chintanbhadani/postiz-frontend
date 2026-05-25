// import store from '@/lib/store';
import store from '@/store/store';
import axios from 'axios';

export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const dataService = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer `
  }
});

dataService.interceptors.request.use(function (config) {
  const { base } = store.getState();

  console.log(base.token, "  token");


  const token = base.token ? `Bearer ${base.token}` : null;

  config.headers.Authorization = token ? token : '';
  return config;
});

export default dataService;
