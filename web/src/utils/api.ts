import axios from "axios";
import useSWR from 'swr'

// console.log(typeof localStorage.getItem('cookie'))

export const axiosCreate = axios.create({
  // baseURL: 'https://gfdp.dizelequefez.com.br',
  baseURL: 'http://localhost:3000',
  params: {
    cookie: localStorage.getItem('cookie')
  }
});

const request = {
  getDay: () => axiosCreate.get('pontos/dia'),
  getMonth: () => axiosCreate.get('pontos/mes')
}


export const api = (route: keyof typeof request) => {
  return useSWR(route, async () => {
    const { data } = await request[route]()
    return data
  })
}


