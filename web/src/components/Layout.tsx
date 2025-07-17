import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
export function Layout() {

  return (
    <div className='flex flex-col gap-5 bg-gray-500 text-white h-screen'>
      <Header />
      <main className="p-10 h-screen flex flex-col items-center justify-center">
        <Outlet />
      </main>

    </div>
  )
}

function Header() {

  let navigate = useNavigate()

  useEffect(() => {
    const access = localStorage.getItem('access')
    if (!access) {
      navigate('/login')
    }
  }, [])

  return (
    <nav className='bg-gray-800 p-5 shadow-2xl flex justify-end gap-5 '>
      <NavLink to="/">Home</NavLink>
      <button
        className="cursor-pointer"
        onClick={() => {
          localStorage.removeItem('access')
          navigate('/login')
        }}>
        Sair
      </button>
    </nav>
  )
}