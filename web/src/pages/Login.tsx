import type { FormEvent } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useNavigate } from "react-router";

export function Login() {

  const navigate = useNavigate()
  function handleAccess(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()


    const username = event.currentTarget.username.value
    const password = event.currentTarget.password.value

    const access = btoa(`${username}:${password}`) // btoa(username + password)

    localStorage.setItem('access', access)

    navigate('/')
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-500 text-white p-10">
      <form
        onSubmit={handleAccess}
        className='flex flex-col gap-4 bg-gray-800 p-12 rounded-xl shadow-2xl w-full lg:w-1/3 '
      >
        <Input name='username' placeholder='Usuário' />
        <Input name='password' placeholder='Senha' type='password' autoComplete="on" />
        <Button>
          Salvar
        </Button>
      </form>
    </main>
  )
}