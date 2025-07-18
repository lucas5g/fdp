import { api } from "@/utils/api"
import { Card, Heading, Table } from "@chakra-ui/react"


export function PointDay() {
  const { data, isLoading, error } = api('getDay') as { data: { [key: string]: string }, isLoading: boolean, error: any }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Card.Root>
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