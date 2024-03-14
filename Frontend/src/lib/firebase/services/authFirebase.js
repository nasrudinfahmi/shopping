import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, provider } from "../init";
import { createDataUser, getDataUser } from "../services/userFirestore";

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
      console.log(error);
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

export {
  registerWithEmailAndPassword,
  loginWithEmailAndPassword,
  logout,
  deleteAccount,
  loginGoogleClient,
};
