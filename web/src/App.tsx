import { BrowserRouter, Route, Routes } from 'react-router';
import Login from './Login';
import Pontos from './Pontos';
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Pontos />} />
        {/* <Route path='*' element={<Navigate to="/login" replace />} /> */}
      </Routes>
    </BrowserRouter>
  );
}


