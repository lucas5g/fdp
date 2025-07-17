

interface Props extends React.HTMLAttributes<HTMLDivElement> { }

export function Card(props: Readonly<Props>) {
  return (
    <div className={`bg-gray-800 p-12 rounded-xl shadow-2xl w-full`}>
      {props.children}
    </div>
  )
}