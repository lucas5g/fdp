import { Navigate } from "react-router"

export function Logout() {
  localStorage.removeItem('value')
  return <Navigate to={'/login'} replace={true} />
}