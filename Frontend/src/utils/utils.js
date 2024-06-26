import { getDataUser } from "../lib/firebase/services/userFirestore";

const formattedIDR = (price) => {
  const num = Number(price);
  const IDR = num.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  return IDR;
};

const getValueById = (idValue) => {
  if (!idValue) return null;
  const element = document.getElementById(idValue);

  if (!element) return null;
  return element.value.trim();
};

const getCredentialAuthUser = (isLogin) => {
  const email = getValueById("email");
  const password = getValueById("password");

  if (isLogin) return { email, password };

  const confPassword = getValueById("confPassword");
  const username = getValueById("username");
  const telepon = getValueById("telepon");

  return { email, password, confPassword, username, telepon };
};

const validateIndonesianPhoneNumber = (phoneNumber) => {
  // Format yang valid: 081234567890 atau +6281234567890
  const pattern = /^(\+62|62|0)(\d{9,15})$/;
  return pattern.test(phoneNumber);
};

const getPathFromFirebaseStorageUrl = (url) => {
  if (!url) return false;
  if (url.includes("shopping-yuk.appspot.com")) {
    const pathUrl = decodeURIComponent(url.split("/o/")[1].split("?")[0]);
    return pathUrl;
  }

  return false;
};

const saveUserInfoToLocalstorage = async (email) => {
  try {
    const userResponse = await getDataUser(email);
    const user = userResponse.data?.data?.userData;
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

const generateRandomString = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*()_-+=?><";
  let result = "";

  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result + Math.random().toString(36).substring(8);
};

export {
  formattedIDR,
  getValueById,
  getCredentialAuthUser,
  validateIndonesianPhoneNumber,
  getPathFromFirebaseStorageUrl,
  saveUserInfoToLocalstorage,
  generateRandomString,
};
