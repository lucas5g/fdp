import { useEffect } from "react";
import { Card } from "../components/Card";

export function Home(){

  useEffect(() => {
    const access = localStorage.getItem('access')
   
    

  }, [])



  return(
    <div className="flex flex-row gap-5">
      <Card>
        <h1>Home</h1>
      </Card>
      <Card>
        <h1>Lista</h1>
      </Card>
    </div>
  )
}