interface Props extends React.InputHTMLAttributes<HTMLInputElement> { }
export function Input(props: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={props.name}>
        {props.placeholder}
      </label>
      <input 
        className=" bg-gray-700 text-white py-3 px-2 rounded"
        required
        {...props} 
        
        />
    </div>
  )

}