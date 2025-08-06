import {
  Route, Routes
} from 'react-router'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Layout } from '@/components/Layout'
import { Logout } from '@/pages/Logout'
import { Generate } from './pages/Generate'

export function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/sair' element={<Logout />} />
      <Route path='/gerar' element={<Generate />} />
      <Route element={<Layout />} >
        <Route index element={<Home />} />
        <Route path='/home' element={<Home />} />
      </Route>
      <Route path='*' element={<Logout />} />
    </Routes>
  )
}
