import type { AxiosError } from "axios";
import { Navigate } from "react-router";

export function ErrorPage(props: Readonly<{ error: AxiosError }>) {

  if (props.error.response?.data && typeof props.error.response.data === 'object') {
    const data = props.error.response.data as { message: string };
    window.alert(data.message);
  }

  localStorage.removeItem('value')

  return <Navigate to={'/login'} replace={true} />

}