import axios from "axios";
import useSWR from 'swr'


export const axiosCreate = axios.create({
  // baseURL: 'https://gfdp.dizelequefez.com.br',
  baseURL: 'http://localhost:3000',
  params: {
    value: localStorage.getItem('value')
  }
});

const request = {
  getDay: () => axiosCreate.get('pontos/dia'),
  getMonth: () => axiosCreate.get('pontos/mes'),
  
}


export const api = (route: keyof typeof request) => {
  return useSWR(route, async () => {
    const { data } = await request[route]()
    return data
  })
}


