interface Props {
  placeholderText?: string;
}

export default function Search({placeholderText}: Props) {
  return <div 
    className="w-full py-[15px] px-[10%] flex place-content-around"
    style={{backgroundColor: "#D1D5DB"}}
  >
    <div className="search-input flex w-[40%]">
      <input 
        type="text" 
        className="rounded-[5px] border-black"
        placeholder={placeholderText || "Search"}
      />
      {/* TODO: Icons */}
    </div>
  </div>;
}