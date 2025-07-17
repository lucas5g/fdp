import { Card } from "../components/Card";
import { PointDay } from "../components/point/Day";
import { PointMonth } from "../components/point/Month";

export function Home() {

  return (
    <div className="flex  gap-5 w-full bg-amber-400">
      <PointDay />
      <Card>
        <p>teste</p>
      </Card>
      {/* <PointMonth /> */}
    </div>
  )

}