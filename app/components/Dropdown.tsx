interface Props {
  placeholderText: string
  data: any[]
  title?: string
}

export default function Dropdown({placeholderText, data, title}: Props) {
  return <select name={placeholderText} 
                 className="w-full h-full"
  >     
    <option value="placeholder" 
            style={{color: "#747474"}}
    >
              {placeholderText}
    </option>
    {data.map(item => <option>{item}</option>)}
  </select>
}