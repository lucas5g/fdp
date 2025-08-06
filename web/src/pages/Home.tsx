import { Card } from "@/components/Card";
import { PointDay } from "@/components/point/Day";
import { Button, Flex } from "@chakra-ui/react";
import { Link } from "react-router";

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
          <Link to="/gerar">
            <Button variant={'surface'}>
              Gerar
            </Button>
          </Link>
        </Flex>
      </Card>
    </Flex>
  )

}