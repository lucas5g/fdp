import { Stack } from "@chakra-ui/react";
import { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router";
export function Layout() {

  return (
    <>
      <Header />
      <Outlet />

    </>
  )
}

function Header() {

  let navigate = useNavigate()

  useEffect(() => {
    const value = localStorage.getItem('value')
    if (!value) {
      navigate('/login')
    }
  }, [])

  return (
    <Stack
      direction={'row'}
      background={'gray.900'}
      padding={5}
      justifyContent={'end'}
    >
      <Link
        to="/">
        Home
      </Link>
      <Link to="/sair">Sair</Link>
    </Stack>
  )
}