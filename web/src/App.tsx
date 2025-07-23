import {
  Route, Routes
} from 'react-router'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Layout } from '@/components/Layout'
import { Logout } from '@/pages/Logout'

export function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/sair' element={<Logout />} />
      <Route element={<Layout />} >
        <Route index element={<Home />} />
      </Route>
    </Routes>
  )
}
