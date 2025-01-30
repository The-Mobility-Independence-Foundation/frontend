import axios from "axios";

const BASE_URL = "https://jsonplaceholder.typicode.com"

const fetch = async (route: string) => {
  const request = axios.get(`${BASE_URL}${route}`);
  return request
    .then(response => response.data)
    .catch(error => console.log(error));
}

const create = async (route: string, data: any) => {
  const request = axios.post(`${BASE_URL}${route}`, data)
  return request
    .then(response => response.data)
    .catch(error => console.log(error));
}

const update = async (route: string, data: any) => {
  const request = axios.put(`${BASE_URL}${route}`, data);
  return request
    .then(response => response.data)
    .catch(error => console.log(error));
}

const remove = async (route: string) => {
  const request = axios.delete(`${BASE_URL}${route}`);
  return request
    .then(response => response.data)
    .catch(error => console.log(error));
}

export {fetch, create, update, remove}