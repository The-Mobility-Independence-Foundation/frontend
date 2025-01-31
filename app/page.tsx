import Image from "next/image";
import Filters from "./components/Filters";

export default function Home() {
  return (
    <Filters partTypes={["Type 1", "Type 2", "Type 3", "Type 4"]} brands={["Brand 1", "Brand 2", "Brand 3", "Brand 4"]}></Filters>
  );
}
