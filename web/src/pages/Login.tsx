import { Input } from "@/components/Input";
import { PasswordInput } from "@/components/ui/password-input";
import { api, axiosCreate } from "@/utils/api";
import { timeout } from "@/utils/timeout";
import {
  Button, Card, Field, Flex,
  For,
  Spinner, Stack
} from "@chakra-ui/react";
import e from "express";
import { useEffect, useState, type FormEvent } from "react";

import { useNavigate } from "react-router";
export function Login() {

  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const access = localStorage.getItem('access')
    if (access) {
      navigate('/')
    }
  })
  async function handleAccess(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    await timeout(1000)

    const payload = Object.fromEntries(new FormData(event.target as HTMLFormElement))
    
    const { data } = await axiosCreate.post('pontos/login', payload)

    console.log(data)

    setIsLoading(false)
  }

  return (
    <Flex
      height={'100vh'}
      justify={'center'}
      align={'center'}
      padding={5}

    >
      <Card.Root
        lg={{
          width: '1/3'
        }}
        width={'full'}
      >
        <Card.Header>
          <Card.Title>
            Login
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleAccess}>
            <Stack
              width={'full'}
              gap={4}
            >
              <Input
                name="username"
                placeholder="Usuário"
                autoComplete="username"

              />
              <Input name="password" type="password" placeholder="Senha" />


              <Button
                type="submit"
              // disabled={isLoading}
              >
                {isLoading ? <Spinner /> : 'Acessar'}
              </Button>
            </Stack>
          </form>
        </Card.Body>
      </Card.Root>
    </Flex>
  )
}