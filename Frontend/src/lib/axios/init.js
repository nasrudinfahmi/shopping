import axios from "axios";

const userAxios = axios.create({
  baseURL: `${process.env.SHOPPING_USER_API}`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const sellerAxios = axios.create({
  baseURL: `${process.env.SHOPPING_SELLER_API}`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const regionAxios = axios.create({
  baseURL: `${process.env.REGION_ROOT_API}`,
  method: "GET",
});

const productAxios = axios.create({
  baseURL: `${process.env.SHOPPING_PRODUCTS_API}`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export { userAxios, sellerAxios, regionAxios, productAxios };
