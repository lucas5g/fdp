import { Navigate } from "react-router"

export function Logout() {
  localStorage.removeItem('access')
  return <Navigate to={'/login'} replace={true} />
}