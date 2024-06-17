import { cartAxios } from "../../axios/init";
import { auth } from "../init";
import { getNewToken, getToken } from "./userFirestore";

const addToCart = async ({ email, qty, uid, uids, storeName, variations }) => {
  try {
    const exp = auth?.currentUser?.stsTokenManager?.expirationTime;
    const token = Date.now() > exp ? await getNewToken() : await getToken();

    const data = { email, qty, uid, uids, storeName, variations };

    const cartsResponse = await cartAxios({
      url: "/add",
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      data: JSON.stringify(data),
    });

    return cartsResponse.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error.message);
    }
  }
};

const getCarts = async (email) => {
  try {
    const exp = auth?.currentUser?.stsTokenManager?.expirationTime;
    const token = Date.now() > exp ? await getNewToken() : await getToken();

    const cartsResponse = await cartAxios({
      url: `/get?email=${email}`,
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    return cartsResponse.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error.message);
    }
  }
};

const toggleCartsStatus = async ({ email, uids, idCart }) => {
  try {
    const exp = auth?.currentUser?.stsTokenManager?.expirationTime;
    const token = Date.now() > exp ? await getNewToken() : await getToken();

    const cartsResponse = await cartAxios({
      url: "/update/status",
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      data: JSON.stringify({ email, uids, idCart }),
    });

    return cartsResponse.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error.message);
    }
  }
};

const toggleAllCartsStatus = async (email) => {
  try {
    const exp = auth?.currentUser?.stsTokenManager?.expirationTime;
    const token = Date.now() > exp ? await getNewToken() : await getToken();

    const cartsResponse = await cartAxios({
      url: "/update/status/all",
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      data: JSON.stringify({ email }),
    });

    return cartsResponse.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error.message);
    }
  }
};

const editQty = async ({ email, uids, idCart, qty }) => {
  try {
    const exp = auth?.currentUser?.stsTokenManager?.expirationTime;
    const token = Date.now() > exp ? await getNewToken() : await getToken();

    const cartsResponse = await cartAxios({
      url: "/update/qty",
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      data: JSON.stringify({ email, uids, idCart, qty }),
    });

    return cartsResponse.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error.message);
    }
  }
};

const deleteProductsCart = async ({ email, uids, idCart }) => {
  try {
    const exp = auth?.currentUser?.stsTokenManager?.expirationTime;
    const token = Date.now() > exp ? await getNewToken() : await getToken();

    const cartsResponse = await cartAxios({
      url: "/delete/product",
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      data: JSON.stringify({ email, uids, idCart }),
    });

    return cartsResponse.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error.message);
    }
  }
};

const deleteManyProductsCart = async ({ email, products }) => {
  try {
    const exp = auth?.currentUser?.stsTokenManager?.expirationTime;
    const token = Date.now() > exp ? await getNewToken() : await getToken();

    const cartsResponse = await cartAxios({
      url: "/delete/products",
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      data: JSON.stringify({ email, products }),
    });

    return cartsResponse.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error.message);
    }
  }
};

export {
  addToCart,
  getCarts,
  toggleCartsStatus,
  toggleAllCartsStatus,
  editQty,
  deleteProductsCart,
  deleteManyProductsCart,
};
