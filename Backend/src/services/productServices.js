import { FieldValue } from "firebase-admin/firestore";
import {
  productFirestore,
  productCollection,
} from "../lib/firebaseAdmin/services/firestore.js";
import { db } from "../lib/firebaseAdmin/init.js";

const createNewProduct = async ({
  uid,
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
    const datas = {
      uid,
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
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };
    await productFirestore(uid).create(datas);
  } catch (error) {
    throw new Error(error.message);
  }
};

const getSellersProduct = async (uids) => {
  try {
    const sellersProducts = await productCollection()
      .where("uids", "==", uids)
      .get();
    if (sellersProducts.empty) return null;

    let products = [];
    sellersProducts.forEach((doc) => {
      products.push(doc.data());
    });

    return products;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteAllSellersProducts = async (uids) => {
  try {
    const sellersProducts = await productCollection()
      .where("uids", "==", uids)
      .get();
    if (sellersProducts.empty) return;

    const batch = db.batch();
    sellersProducts.forEach(async (doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  } catch (error) {
    throw new Error(error.message);
  }
};

export { createNewProduct, getSellersProduct, deleteAllSellersProducts };
