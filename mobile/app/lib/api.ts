// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://62.84.102.222:8000', // адрес твоего FastAPI backend
  timeout: 5000,
});

export default api;