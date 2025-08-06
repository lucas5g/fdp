import { Card as CardUi } from '@chakra-ui/react'
interface Props {
  title?: string
  children: React.ReactNode
}
export function Card({ title, children }: Readonly<Props>) {
  return (
    <CardUi.Root
      w={'full'}
      lg={{ w: '1/3' }}
      overflow={'hidden'}
      height={'min-content'}
    >
      {title &&
        <CardUi.Header>
          <CardUi.Title>
            {title}
          </CardUi.Title>
        </CardUi.Header>
      }
      <CardUi.Body>
        {children}
      </CardUi.Body>
    </CardUi.Root>
  )

}