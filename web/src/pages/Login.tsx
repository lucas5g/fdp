import { PasswordInput } from "@/components/ui/password-input";
import { Button, Card, Field, Flex, Input, Stack } from "@chakra-ui/react";
import { useEffect, type FormEvent } from "react";

import { useNavigate } from "react-router";
export function Login() {

  const navigate = useNavigate()

  useEffect(() => {
    const access = localStorage.getItem('access')
    if (access) {
      navigate('/')
    }
  })
  function handleAccess(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()


    const username = event.currentTarget.username.value
    const password = event.currentTarget.password.value

    const access = btoa(`${username}:${password}`)

    localStorage.setItem('access', access)

    navigate('/')
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
            <Stack width={'full'}>
              <Field.Root>
                <Field.Label>Usuário</Field.Label>
                <Input name="username" placeholder="Usuário" />
              </Field.Root>

              <Field.Root>
                <Field.Label>Senha</Field.Label>
                <PasswordInput name="password" placeholder="Senha" />
              </Field.Root>
              <Button type="submit">
                Acessar
              </Button>
            </Stack>
          </form>
        </Card.Body>
      </Card.Root>
    </Flex>
  )
}