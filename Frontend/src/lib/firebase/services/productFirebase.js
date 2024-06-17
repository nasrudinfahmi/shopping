import { productAxios } from "../../axios/init";
import { auth } from "../init";
import { deleteFileFromStorage } from "./storage";
import { getNewToken, getToken } from "./userFirestore";

const addNewProduct = async ({
  uids,
  productName,
  price,
  summary,
  delivery,
  brand,
  status,
  qty,
  thumbProduct,
  imgs,
  tagVariations,
  descriptions,
}) => {
  try {
    const exp = auth?.currentUser?.stsTokenManager?.expirationTime;
    const token = Date.now() > exp ? await getNewToken() : await getToken();

    const datas = {
      uids,
      productName,
      price,
      summary,
      delivery,
      brand,
      status,
      qty,
      thumbProduct,
      imgs,
      tagVariations,
      descriptions,
    };

    const productResponse = await productAxios({
      url: "/create",
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      data: JSON.stringify(datas),
    });

    return productResponse.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllSellersProducts = async (uids) => {
  try {
    const exp = auth?.currentUser?.stsTokenManager?.expirationTime;
    const token = Date.now() > exp ? await getNewToken() : await getToken();

    const productResponse = await productAxios({
      url: `/get/s?uids=${uids}`,
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    return productResponse.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error.message);
    }
  }
};

const deleteAllSellersProducts = async (uids) => {
  try {
    const exp = auth?.currentUser?.stsTokenManager?.expirationTime;
    const token = Date.now() > exp ? await getNewToken() : await getToken();

    // mendapatkan seluruh sellers products
    const productsResponse = await getAllSellersProducts(uids);

    // ambil img url nya
    const imgUrl = productsResponse.data
      .map((product) => {
        const url = [...product.imgs, product.thumbProduct];
        return url;
      })
      ?.flat();

    // hapus img products
    imgUrl.forEach(async (url) => await deleteFileFromStorage(url));

    // delete data products
    const productResponse = await productAxios({
      url: `/delete/s?uids=${uids}`,
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    return productResponse.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error.message);
    }
  }
};

const updateProduct = async ({
  uid,
  productName,
  price,
  summary,
  delivery,
  brand,
  status,
  qty,
  thumbProduct,
  imgs,
  tagVariations,
  descriptions,
}) => {
  try {
    const exp = auth?.currentUser?.stsTokenManager?.expirationTime;
    const token = Date.now() > exp ? await getNewToken() : await getToken();

    const datas = {
      uid,
      productName,
      price,
      summary,
      delivery,
      brand,
      status,
      qty,
      thumbProduct,
      imgs,
      tagVariations,
      descriptions,
    };

    const productResponse = await productAxios({
      url: "/update",
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      data: JSON.stringify(datas),
    });

    return productResponse.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error.message);
    }
  }
};

const getProducts = async () => {
  try {
    const productResponse = await productAxios({
      url: "/get/all",
      method: "GET",
    });

    return productResponse.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error.message);
    }
  }
};

const getProduct = async (uid) => {
  try {
    const exp = auth?.currentUser?.stsTokenManager?.expirationTime;
    const token = Date.now() > exp ? await getNewToken() : await getToken();

    const productResponse = await productAxios({
      url: `/get?uid=${uid}`,
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    return productResponse.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error.message);
    }
  }
};

const deleteProduct = async (uid, images) => {
  try {
    if (!uid || !images) throw new Error("Data tidak valid!");
    const exp = auth?.currentUser?.stsTokenManager?.expirationTime;
    const token = Date.now() > exp ? await getNewToken() : await getToken();

    const deleteProductResponse = await productAxios({
      url: `/delete?uid=${uid}`,
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      data: JSON.stringify({ images }),
    });

    return deleteProductResponse.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error.message);
    }
  }
};

export {
  addNewProduct,
  getAllSellersProducts,
  deleteAllSellersProducts,
  updateProduct,
  getProducts,
  getProduct,
  deleteProduct,
};
