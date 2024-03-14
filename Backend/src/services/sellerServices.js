import { FieldValue } from "firebase-admin/firestore";
import { sellerFirestore } from "../lib/firebaseAdmin/services/firestore.js";

const createNewSeller = async ({
  uids,
  storeName,
  address,
  phoneNumber,
  domain,
  email,
}) => {
  try {
    const datas = {
      uids,
      storeName,
      address,
      phoneNumber,
      domain,
      email,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };
    await sellerFirestore(uids).create(datas);
  } catch (error) {
    throw new Error(error.message);
  }
};

const getSeller = async (uids) => {
  try {
    const sellerResponse = await sellerFirestore(uids).get();
    const seller = sellerResponse.data();
    return seller;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteSeller = async (uids) => {
  try {
    await sellerFirestore(uids).delete();
  } catch (error) {
    throw new Error(error.message);
  }
};

export { createNewSeller, getSeller, deleteSeller };
