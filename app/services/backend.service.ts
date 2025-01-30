import axios from "axios";

const fetch = async (route: string) => {
  const request = axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}${route}`);
  return request
    .then(response => response.data)
    .catch(error => console.log(error));
}

const create = async (route: string, data: any) => {
  const request = axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}${route}`, data)
  return request
    .then(response => response.data)
    .catch(error => console.log(error));
}

const update = async (route: string, data: any) => {
  const request = axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}${route}`, data);
  return request
    .then(response => response.data)
    .catch(error => console.log(error));
}

const remove = async (route: string) => {
  const request = axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}${route}`);
  return request
    .then(response => response.data)
    .catch(error => console.log(error));
}

export {fetch, create, update, remove}