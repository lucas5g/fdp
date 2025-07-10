interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button(props: Props) {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold  py-3 rounded cursor-pointer"
      {...props}
    />
  )

}