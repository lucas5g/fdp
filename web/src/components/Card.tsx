

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export function Card(props: Props){
  return(
    <div className="bg-gray-800 p-10 rounded-xl shadow-2xl">
      {props.children}
    </div>
  )
}