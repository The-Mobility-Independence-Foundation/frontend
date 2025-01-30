"use client";

import { useEffect, useState } from "react";
import {fetch, create, update, remove} from "./services/backend.service";

export default function Home() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("/posts").then(response => setData(response));
  }, [])
  console.log(data)
  return <div>{"erm"}</div>
}
