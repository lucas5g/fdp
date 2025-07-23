import { Navigate } from "react-router"

export function Logout() {
  localStorage.removeItem('cookie')
  return <Navigate to={'/login'} replace={true} />
}