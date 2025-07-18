import { PointDay } from "@/components/point/Day";
import { Card, Flex } from "@chakra-ui/react";

export function Home() {

  return (
    <Flex
      height={'90vh'}
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
        <PointDay />
        {/* <PointMonth /> */}
      </Card.Root>
    </Flex>
  )

}