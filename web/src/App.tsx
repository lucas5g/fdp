import { Route, Routes } from 'react-router'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Layout } from './components/Layout'
export function App() {
  return (
    <Routes >
      <Route path='/login' element={<Login />} />
      <Route element={<Layout />} >
        <Route index element={<Home />} />
      </Route>
    </Routes>
  )
}
// import { useEffect, useState, type FormEvent } from 'react'
// import { Button } from './components/Button'
// import { Card } from './components/Card'
// import { Input } from './components/Input'
// export function App() {

//   const [showLogin, setShowLogin] = useState(false)

//   useEffect(() => {
//     const access = localStorage.getItem('access')
//     if (!access) {
//       setShowLogin(true)

//     }
//   }, [showLogin])

//   function handleAccess(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault()

//     setShowLogin(false)
//   }

//   return (
//     <div className='bg-gray-600 h-screen p-10 text-white flex flex-col gap-4 items-center justify-center'>

//       {showLogin && (
//         
//       )}

//       <Card>
//         <h1 className='text-2xl font-bold'>Folha de Ponto</h1>
//       </Card>
//     </div>
//   )
// }

// export default App
