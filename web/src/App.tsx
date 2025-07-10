import { Button } from './components/Button'
import { Card } from './components/Card'
import { Input } from './components/Input'

export function App() {

  return (
    <div className='bg-gray-600 h-screen p-10 text-white'>
      <Card>
        <form className='flex flex-col gap-4'>
          <Input name='username' placeholder='Usuário' />
          <Input name='password' placeholder='Senha' type='password' />
          <Button>
            teste
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default App
