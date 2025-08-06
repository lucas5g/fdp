import { Card } from "@/components/Card";
import { PointDay } from "@/components/point/Day";
import { Button, Flex } from "@chakra-ui/react";

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

      <Card title="Gerar Relatório">
        <Flex>
          <Button variant={'surface'}>
            Gerar
          </Button>
        </Flex>
      </Card>
    </Flex>
  )

}