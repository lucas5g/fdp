import { ErrorPage } from "@/pages/Error"
import { api } from "@/utils/api"
import { HStack, Skeleton, SkeletonCircle, Stack, Table } from "@chakra-ui/react"
import type { AxiosError } from "axios"
import { Card } from "@/components/Card"
import { useEffect, useState } from "react"


export function PointDay() {
  const [list, setList] = useState<Record<string, string>>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<AxiosError>()

  useEffect(() => {
    const listActual = localStorage.getItem('day')
    if (listActual) {
      setList(JSON.parse(listActual))
      setIsLoading(false)
    }

    api.get('pontos/dia', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('value')}`
      }
    })
      .then(({ data }) => {
        setList(data)
        localStorage.setItem('day', JSON.stringify(data))
      })
      .catch((e) => {
        setError(e)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])


  if (isLoading) {
    return (
      <Card>
        <Stack flex="1">
          <Skeleton height="5" width={'30%'} />
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton height="10" key={`skeleton-${index + 1}`} />
          ))}
        </Stack>
      </Card>
    )
  }


  if (error) {
    return <ErrorPage error={error} />
  }


  return (

    <Card title={'Pontos do Dia'}>
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
          {list && Object.entries(list).map(([key, value]) => (
            <Table.Row key={key}>
              <Table.Cell>{key}</Table.Cell>
              <Table.Cell>{value}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Card>
  )


}