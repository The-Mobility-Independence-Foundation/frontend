"use client";

import { useEffect, useState } from "react";
import backendService from "./services/backend.service";

export default function Home() {
  const [data, setData] = useState(null);
  useEffect(() => {
    backendService.get("/posts").then(response => setData(response));
  }, [])
  console.log(data);
  return <div>{"erm"}</div>
}
