import { validateIndonesianPhoneNumber } from "../../../utils/utils";
import { userAxios } from "../../axios/init";
import { auth } from "../init";

const getNewToken = async () => {
  try {
    const token = await auth.currentUser.getIdToken(true);
    return token;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error.message);
    }
  }
};

const getToken = async () => {
  try {
    const token = await auth.currentUser.getIdToken();
    return token;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error.message);
    }
  }
};

const getDataUser = async (email) => {
  try {
    const exp = auth?.currentUser?.stsTokenManager?.expirationTime;
    const token = Date.now() > exp ? await getNewToken() : await getToken();

    if (token) {
      const user = await userAxios({
        url: `/get?email=${email}`,
        method: "GET",
        data: JSON.stringify({ email }),
        headers: { Authorization: `Bearer ${token}` },
      });

      return user;
    }

    return null;
  } catch (error) {
    if (error.response) {
      console.log(error.response.data.message);
    } else {
      console.log(error.message);
    }
  }
};

const updateDataUser = async (
  email,
  { displayName, photoURL, role, phoneNumber, emailVerified, address, uids }
) => {
  try {
    const exp = auth?.currentUser?.stsTokenManager?.expirationTime;
    const token = Date.now() > exp ? await getNewToken() : await getToken();

    if (!email || email.trim() === "") throw new Error("Data tidak valid!");

    if (phoneNumber && phoneNumber.trim() !== "") {
      const isPhoneNumberValid = validateIndonesianPhoneNumber(phoneNumber);
      if (!isPhoneNumberValid) throw new Error("Nomor telepon tidak valid!");
    }

    const datas = {
      displayName,
      photoURL,
      role,
      phoneNumber,
      emailVerified,
      address,
      uids,
    };
    let dataToUpdate = {};

    for (const [key, value] of Object.entries(datas)) {
      if (typeof value === "string" && value.trim() !== "") {
        dataToUpdate[key] = value.trim();
      }

      if (key === "photoURL" && typeof value !== "string" && value === null) {
        dataToUpdate[key] = null;
      }

      if (key === "emailVerified" && typeof value === "boolean") {
        dataToUpdate[key] = value;
      }

      if (key === "address" && typeof value !== "undefined") {
        dataToUpdate[key] = value;
      }
    }

    if (Object.keys(dataToUpdate).length === 0) {
      throw new Error("Data tidak valid!");
    }

    if (token) {
      const user = await userAxios({
        url: `/update?email=${email}`,
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        data: JSON.stringify(dataToUpdate),
      });

      return user.data;
    }

    return null;
  } catch (error) {
    console.log(error);
    if (error.response) {
      console.log(error.response.data.message);
    } else {
      console.log(error.message);
    }
  }
};

const createDataUser = async ({
  uid,
  displayName,
  email,
  phoneNumber,
  photoURL,
  emailVerified,
}) => {
  try {
    const datas = {
      email,
      displayName,
      photoURL,
      uid,
      emailVerified,
      phoneNumber,
    };
    const exp = auth?.currentUser?.stsTokenManager?.expirationTime;
    const token = Date.now() > exp ? await getNewToken() : await getToken();

    if (token) {
      const user = await userAxios({
        url: "/create",
        method: "POST",
        data: JSON.stringify(datas),
        headers: { Authorization: `Bearer ${token}` },
      });

      return user.data;
    }
  } catch (error) {
    if (error.response) {
      console.log(error.response.data.message);
    } else {
      console.log(error.message);
    }
  }
};

const deleteDataUser = async (email) => {
  try {
    const exp = auth?.currentUser?.stsTokenManager?.expirationTime;
    const token = Date.now() > exp ? await getNewToken() : await getToken();

    if (token) {
      const user = await userAxios({
        url: "/delete",
        method: "DELETE",
        data: JSON.stringify({ email }),
        headers: { Authorization: `Bearer ${token}` },
      });

      return user.data;
    }

    return null;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error.message);
    }
  }
};

export {
  getDataUser,
  updateDataUser,
  createDataUser,
  deleteDataUser,
  getNewToken,
  getToken,
};
