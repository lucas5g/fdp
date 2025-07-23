import axios from "axios";
import useSWR from 'swr'

const access = localStorage.getItem('access')

const [username, password] = atob(access!).split(':')

const axiosCreate = axios.create({
  // baseURL: 'https://gfdp.dizelequefez.com.br',
  baseURL: 'http://localhost:3000',
});

const request = {
  getDay: () => axiosCreate.get('pontos/dia', {
    params: {
      username,
      password
    },
  }),
  getMonth: () => axiosCreate.get('pontos/mes', {
    params: {
      username,
      password
    },
  }),
}


export const api = (route: keyof typeof request) => {
  return useSWR(route, async () => {
    const { data } = await request[route]()
    return data
  })
}


