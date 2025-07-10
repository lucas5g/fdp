import { useState, type FormEvent } from 'react'
import { Button } from './components/Button'
import { Card } from './components/Card'
import { Input } from './components/Input'

export function App() {

  const [access, setAccess] = useState<string>()

  function handleAccess(event:FormEvent<HTMLFormElement>) {
    event.preventDefault()
  
    const username = event.currentTarget.username.value
    const password = event.currentTarget.password.value

    const buffer = Buffer.from(`${username}:${password}`, 'utf-8')
    const base64 = buffer.toString('base64')

    console.log(username, password);

    console.log(base64)


    
    return { message: 'tes'}
  }

  return (
    <div className='bg-gray-600 h-screen p-10 text-white'>
      <Card>
        <form 
          onSubmit={handleAccess}
          className='flex flex-col gap-4'
          >
          <Input name='username' placeholder='Usuário' />
          <Input name='password' placeholder='Senha' type='password' />
          <Button>
            Salvar
          </Button>
        </form>
      </Card>

      <Card>
        <h2>aqui vai mostrar o resultado</h2>
      </Card>
    </div>
  )
}

export default App
