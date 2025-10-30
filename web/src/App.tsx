import { BrowserRouter, Route, Routes, Navigate } from 'react-router';
import Login from './Login';
import Dash from './Dash';
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/dash' element={<Dash />} />
        <Route path='*' element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}


