const formattedIDR = (price) => {
  const num = Number(price);
  const IDR = num.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
  });
  return IDR.replace(",00", "");
};

const getValueById = (idValue) => {
  if (!idValue) return null;
  const element = document.getElementById(idValue);

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

export {
  formattedIDR,
  getValueById,
  getCredentialAuthUser,
  validateIndonesianPhoneNumber,
};
