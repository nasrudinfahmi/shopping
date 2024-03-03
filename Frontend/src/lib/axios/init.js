import axios from "axios";

const userAxios = axios.create({
  baseURL: `${process.env.SHOPPING_USER_API}`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export { userAxios };
