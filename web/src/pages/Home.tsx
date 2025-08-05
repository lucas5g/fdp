import { PointDay } from "@/components/point/Day";
import { Button, Card, Flex } from "@chakra-ui/react";

export function Home() {

  return (
    <Flex
      height={'90vh'}
      justify={'center'}
      // align={'center'}
      padding={5}
      gap={5}
      direction={'row'}

    >
      <PointDay />

      <Card.Root  lg={{
          width: '1/3'
        }}
        width={'full'}
        height={'min-content'}
        >
        <Card.Header>
          <Card.Title>
            Gerar Relatório
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Flex>
            <Button variant={'surface'}>
              Gerar
            </Button>
          </Flex>
        </Card.Body>
      </Card.Root>
    </Flex>
  )

}