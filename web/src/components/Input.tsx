import { Field, type InputProps, Input as ChakraInput } from "@chakra-ui/react";
import { PasswordInput } from "./ui/password-input";

interface Props extends InputProps { }
export function Input(props: Props) {
  return (
    <Field.Root>
      <Field.Label>
        {props.placeholder}
      </Field.Label>
      {props.type === 'password'
        ? <PasswordInput
          autoComplete="current-password"
          required={true}
          {...props}
        />
        : <ChakraInput
          required={true}
          {...props}
          value={props.value}
        />
      }
    </Field.Root>
  )

}