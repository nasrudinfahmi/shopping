import {
  getCredentialAuthUser,
  validateIndonesianPhoneNumber,
} from "../utils/utils";
import {
  loginGoogleClient,
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
} from "../lib/firebase/services/authFirebase";

// login with google
const loginGoogle = async () => await loginGoogleClient();

// handle auth user
const handleAuthUser = async (isLogin) => {
  try {
    const { email, password, confPassword, telepon, username } =
      getCredentialAuthUser(isLogin);

    if (!isLogin) {
      const user = await handleRegister(
        email,
        password,
        confPassword,
        telepon,
        username
      );
      return user;
    }

    if (isLogin) {
      const user = await handleLogin(email, password);
      return user;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// handle register user
const handleRegister = async (
  email,
  password,
  confPassword,
  telepon,
  username
) => {
  try {
    const datas = { email, password, confPassword, telepon, username };
    for (const value of Object.values(datas)) {
      if (!value || value.trim() === "") throw new Error("Data tidak valid!");
    }

    const isPhoneValid = validateIndonesianPhoneNumber(telepon);
    if (!isPhoneValid) throw new Error("Nomor telepon tidak valid!");

    if (password !== confPassword) {
      throw new Error("Password dan confirm password tidak cocok");
    }

    const user = await registerWithEmailAndPassword(
      email,
      password,
      telepon,
      username
    );

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// handle login user
const handleLogin = async (email, password) => {
  try {
    if (!email || !password || email.trim() === "" || password.trim() === "") {
      throw new Error("Data tidak valid!");
    }

    const user = await loginWithEmailAndPassword(email, password);
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export { loginGoogle, handleAuthUser };
