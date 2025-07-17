
import type { FormEvent } from "react";
// import { Button } from "../components/Button";
// import { Input } from "../components/Input";
import { useNavigate } from "react-router";
import { TextField, Box, Button, Grid, Stack, Card } from '@mui/material'
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
    <Box>  
      <Button variant="contained" size="large">teste</Button>
    </Box>
    // <main className= "h-screen flex items-center justify-center bg-gray-800">
        // <Stack spacing={2} className="w-full">
        
        //   <TextField id="outlined-basic" label="Outlined" variant="outlined" className="text-white" />
        //   <TextField id="outlined-basic" label="Outlined" variant="outlined" />
        //   <Button variant="contained" size="large"
        //   // onClick={handleAccess}
        //   >
        //     Salvar
        //   </Button>
        // </Stack>

  )

  // <Box>
  //   <button>teste</button>
  // </Box>

  // <main className="flex flex-col items-center justify-center h-screen bg-gray-500 text-white p-10">
  //   <form
  //     onSubmit={handleAccess}
  //     className='flex flex-col gap-4 bg-gray-800 p-12 rounded-xl shadow-2xl w-full lg:w-1/3 '
  //   >
  //     <Input name='username' placeholder='Usuário' />
  //     <Input name='password' placeholder='Senha' type='password' autoComplete="on" />
  //     <Button>
  //       Salvar
  //     </Button>
  //   </form>
  // </main>
}