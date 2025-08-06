import axios from "axios";

export const api = axios.create({
  // baseURL: 'https://gfdp.dizelequefez.com.br',
  baseURL: 'http://localhost:3000',
});

