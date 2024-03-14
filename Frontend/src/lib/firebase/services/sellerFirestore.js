import { sellerAxios } from "../../axios/init";
import { auth } from "../init";
import { getNewToken, getToken } from "./userFirestore";

const getSeller = async (uids) => {
  try {
    const sellerResponse = await sellerAxios({
      url: `/get?uids=${uids}`,
      method: "GET",
    });

    return sellerResponse.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message);
  }
};

const createSeller = async (datas) => {
  try {
    const exp = auth?.currentUser?.stsTokenManager?.expirationTime;
    const token = Date.now() > exp ? await getNewToken() : await getToken();

    const sellerResponse = await sellerAxios({
      url: "/create",
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      data: JSON.stringify(datas),
    });

    return sellerResponse.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error.message);
    }
  }
};

const deleteSeller = async (uids) => {
  try {
    const exp = auth?.currentUser?.stsTokenManager?.expirationTime;
    const token = Date.now() > exp ? await getNewToken() : await getToken();

    const sellerResponse = await sellerAxios({
      url: `/delete?uids=${uids}`,
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    return sellerResponse.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error.message);
    }
  }
};

export { getSeller, createSeller, deleteSeller };
