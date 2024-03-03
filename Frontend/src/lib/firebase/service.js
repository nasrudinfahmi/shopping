import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithRedirect,
} from "firebase/auth";
import { auth, provider } from "./init";
import { userAxios } from "../axios/init";

const registerWithEmailAndPassword = async (
  email,
  password,
  telepon,
  username
) => {
  try {
    const userCreds = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCreds.user;

    await updateProfile(userCreds.user, { displayName: username });

    const userData = {
      uid: user.uid,
      displayName: user.displayName,
      phoneNumber: telepon,
      email: user.email,
      emailVerified: user.emailVerified,
      photoURL: user.photoURL,
    };

    await createDataUser(userData);

    localStorage.setItem("user", JSON.stringify(userData));

    await loginWithEmailAndPassword(email, password);

    return userData;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error.message);
    }
  }
};

const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCreds = await signInWithEmailAndPassword(auth, email, password);
    if (userCreds) {
      const email = userCreds.user.email;

      const userData = await getDataUser(email);
      if (userData) {
        localStorage.setItem(
          "user",
          JSON.stringify(userData.data.data.userData)
        );
        return userData.data.data.userData;
      }
    } else {
      throw new Error("Email belum terdaftar!");
    }
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error.message);
    }
  }
};

const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error.message);
    }
  }
};

const deleteAccount = async (user) => {
  try {
    await deleteUser(user);
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error.message);
    }
  }
};

const loginGoogleClient = async () => {
  try {
    await signInWithRedirect(auth, provider);
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error.message);
    }
  }
};

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

const getDataUser = async (email) => {
  try {
    const exp = auth?.currentUser?.stsTokenManager?.expirationTime;
    const token =
      Date.now() > exp
        ? await getNewToken()
        : await auth?.currentUser?.getIdToken();

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
  { displayName, photoURL, role, emailVerified }
) => {
  try {
    if (!email || email.trim() === "") throw new Error("Data tidak valid!");

    const datas = { displayName, photoURL, role, emailVerified };
    let dataToUpdate = {};

    for (const [key, value] of Object.entries(datas)) {
      if (typeof value === "string" && value.trim() !== "") {
        dataToUpdate[key] = value.trim();
      }

      if (typeof value === "boolean") {
        dataToUpdate[key] = value;
      }
    }

    if (Object.keys(dataToUpdate).length === 0) {
      throw new Error("Data tidak valid!");
    }

    const exp = auth?.currentUser?.stsTokenManager?.expirationTime;
    const token =
      Date.now() > exp
        ? await getNewToken()
        : await auth?.currentUser?.getIdToken();

    if (token) {
      const user = await userAxios({
        url: `/update?email=${email}`,
        method: "PATCH",
        data: JSON.stringify(dataToUpdate),
        headers: { Authorization: `Bearer ${token}` },
      });

      return user.data;
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
    const token =
      Date.now() > exp
        ? await getNewToken()
        : await auth?.currentUser?.getIdToken();

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
    const token =
      Date.now() > exp
        ? await getNewToken()
        : await auth.currentUser?.getIdToken();

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
  registerWithEmailAndPassword,
  loginWithEmailAndPassword,
  logout,
  deleteAccount,
  loginGoogleClient,
  getNewToken,
  getDataUser,
  updateDataUser,
  createDataUser,
  deleteDataUser,
};
