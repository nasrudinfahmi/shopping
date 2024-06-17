import { db } from "../init.js";

const usersFirestore = (doc = null) => {
  const usersRef = db.collection("users").doc(doc);
  return usersRef;
};

const sellerFirestore = (doc = null) => {
  const sellerRef = db.collection("sellers").doc(doc);
  return sellerRef;
};

const productFirestore = (doc = null) => {
  const productRef = db.collection("products").doc(doc);
  return productRef;
};

const productCollection = () => {
  const ref = db.collection("products");
  return ref;
};

const cartCollection = () => {
  const ref = db.collection("cart");
  return ref;
};

export {
  usersFirestore,
  sellerFirestore,
  productFirestore,
  productCollection,
  cartCollection,
};
