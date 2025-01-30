import * as backendService from "./services/backend.service";

interface Post {
  id: number;
  title: string;
}

export default async function Home() {
  const data = await backendService.get("/posts");
  return (data)
}
