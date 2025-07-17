import { api } from "../../utils/api"
import { Card } from "../Card"

export function PointMonth() {
  const { data, isLoading } = api('getMonth') as
    {
      data: [
        {
          dia: string
          diaSemana: string,
          registros: {
            // horas: 'Entrada | Almoco | Retorno | Saida'
            [key in 'Entrada' | 'Almoco' | 'Retorno' | 'Saida']?: string;
          }
        }
      ],
      isLoading: boolean, error: any
    }

  if (isLoading) {
    return <div>Loading...</div>
  }

  function getDayRegister(diaSemana: string, registros: string) {
    return diaSemana === 'SÁBADO' || diaSemana === 'DOMINGO'
      ? diaSemana
      : registros

  }

  return (
    <Card>
      <h1>Dias trabalhados</h1>

      <table>
        <thead>
          <tr className="text-left">
            <th>Dia</th>
            {/* <th>Nome</th> */}
            <th>Registros</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.dia}>
              <td>{item.dia}</td>
              <td>{getDayRegister(item.diaSemana, item.registros)}</td>
              
            </tr>
          ))}
        </tbody>
      </table>


    </Card>

  )


}