"use client";

import axios from "axios";

const BASE_URL = "https://jsonplaceholder.typicode.com"

const get = async (route: string) => {
  const request = axios.get(`${BASE_URL}${route}`);
  return request
    .then(response => response.data)
    .catch(error => console.log(error));
}

const post = async (route: string, data: any) => {
  const request = axios.post(`${BASE_URL}${route}`, data)
  return request
    .then(response => response.data)
    .catch(error => console.log(error));
}

const put = async (route: string, data: any) => {
  const request = axios.put(`${BASE_URL}${route}`, data);
  return request
    .then(response => response.data)
    .catch(error => console.log(error));
}

export {get, post, put}