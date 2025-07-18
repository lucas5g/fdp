import { BrowserRouter } from 'react-router'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { Provider } from '@/components/ui/provider'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Provider>
      <App />
    </Provider>
  </BrowserRouter>,
)
