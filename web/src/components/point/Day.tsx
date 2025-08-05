import { ErrorPage } from "@/pages/Error"
import { api } from "@/utils/api"
import { Card, HStack, Skeleton, Stack, Table } from "@chakra-ui/react"
import type { AxiosError } from "axios"


export function PointDay() {
  const { data, isLoading, error } = api('getDay') as { data: { [key: string]: string }, isLoading: boolean, error: AxiosError }

  if (isLoading) {
    return (
      <Stack gap={2} padding={5}>
        <Skeleton height={5} />
        <Skeleton height={5} />
        <Skeleton height={5} />
        <Skeleton height={5} />
      </Stack>
    )
  }


  if (error) {
    return <ErrorPage error={error} />
  }


  return (
    <Card.Root w={'full'} lg={{ w: '1/3' }}>
      <Card.Header>
        <Card.Title>
          Pontos do Dia
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>
                Pontos
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                Horas
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Object.entries(data).map(([key, value]) => (
              <Table.Row key={key}>
                <Table.Cell>{key}</Table.Cell>
                <Table.Cell>{value}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>

      </Card.Body>
    </Card.Root>
  )


}