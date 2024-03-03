// fungsi untuk membuat response error
const errorResponse = (res, statusCode, errorMessage) => {
  return res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: errorMessage,
  });
};

// fungsi untuk membuat response sukses
const successResponse = (res, statusCode, successMessage, data = {}) => {
  return res.status(statusCode).json({
    success: true,
    status: statusCode,
    message: successMessage,
    ...data,
  });
};

// fungsi untuk validasi nomor telepon indonesia
const validateIndonesianPhoneNumber = (phoneNumber) => {
  // Format yang valid: 081234567890 atau +6281234567890
  const pattern = /^(\+62|62|0)(\d{9,15})$/;
  return pattern.test(phoneNumber);
};

// fungsi untuk mengconvert ke format nomor telepon internasional
function convertToIndonesianPhoneNumber(telepon) {
  if (telepon.startsWith("0")) {
    // Mengganti '0' di awal nomor dengan '+62'
    return "+62" + telepon.slice(1);
  } else if (telepon.startsWith("+62")) {
    // Nomor sudah dalam format internasional
    return telepon;
  } else if (telepon.startsWith("62")) {
    // Menambahkan '+' di awal nomor jika tidak ada
    return "+" + telepon;
  } else {
    // Format nomor telepon tidak valid
    return null;
  }
}

// fungsi untuk mengecek apakah keseluruhan value nilainya undefined atau null
const checkIsAllNullOrUndefined = (obj) => {
  const isNullOrUndefined = (value) => value === null || value === undefined;

  const allValuesNullOrUndefined = (obj) => {
    return Object.values(obj).every(isNullOrUndefined);
  };

  return allValuesNullOrUndefined(obj);
};

export {
  errorResponse,
  successResponse,
  validateIndonesianPhoneNumber,
  convertToIndonesianPhoneNumber,
  checkIsAllNullOrUndefined,
};
