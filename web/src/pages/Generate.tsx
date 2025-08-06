import { useEffect, useState } from "react"

interface ListInterface{
  dia: string,
  diaSemana: string,
  registros: {
    // horas: 'Entrada | Almoco | Retorno | Saida'
    [key in 'Entrada' | 'Almoco' | 'Retorno' | 'Saida']?: string;
  }
}

export function Generate(){

  const [list, setList] = useState<ListInterface[]>()

  useEffect(() => {
    
  })

  return <h1>Gerar Relatorio</h1>
}