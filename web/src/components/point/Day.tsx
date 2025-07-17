import { api } from "../../utils/api"
import { Card } from "../Card"

export function PointDay() {
  const { data, isLoading, error } = api('getDay') as { data: { [key: string]: string }, isLoading: boolean, error: any }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
      <Card>
        <h1>Pontos do Dia</h1>

        <table className="w-[80%]">
          <thead>
            <tr>
              <th className="text-left">Pontos</th>
              <th>Horas</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).map(([key, value]) => (
              <tr key={key}>
                <td>{key}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>


      </Card>
      
  )


}