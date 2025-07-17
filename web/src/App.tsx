import { Route, Routes } from 'react-router'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Layout } from './components/Layout'
import { createTheme, ThemeProvider } from '@mui/material'
export function App() {
  return (
    <ThemeProvider theme={createTheme({
      palette: {
        mode: 'dark',
      },
    })}>

      <Routes >
        <Route path='/login' element={<Login />} />
        {/* <Route element={<Layout />} >
        <Route index element={<Home />} />
        </Route> */}
      </Routes>
    </ThemeProvider>
  )
}
