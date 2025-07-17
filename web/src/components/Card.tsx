

interface Props extends React.HTMLAttributes<HTMLDivElement> { 
  width?: string
}

export function Card(props: Readonly<Props>) {
  return (
    <div className={`bg-gray-800 p-12 rounded-xl shadow-2xl ${props.width ?? 'w-full'}`}>
      {props.children}
    </div>
  )
}