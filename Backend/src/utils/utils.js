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

// fungsi untuk generate random id
const generateRandomId = () => {
  const $1 = Math.random().toString(36).substring(2);
  const $2 = Math.ceil(Math.random() * 36) * Math.round(Math.random() * 56789);
  const $3 = (Math.ceil(Date.now() * Math.random()) * $2).toString(36);

  return `${$1}${$2.toString(36)}${$3}`;
};

// fungsi untuk mendapatkan path url suatu file
const getPathFromFirebaseStorageUrl = (url) => {
  if (!url) return false;
  if (url.includes(process.env.BUCKET_NAME)) {
    const pathUrl = decodeURIComponent(url.split("/o/")[1].split("?")[0]);
    return pathUrl;
  }

  return false;
};

// fungsi untuk mengecek apakah sebuah objek sama key dan valuenya
const areObjectsEqual = (obj1, obj2) => {
  // Mendapatkan daftar kunci dari kedua objek
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Memeriksa jumlah kunci
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Memeriksa setiap kunci dan nilainya
  for (const key of keys1) {
    // Memeriksa apakah kunci ada di kedua objek
    if (!keys2.includes(key)) {
      return false;
    }

    // Memeriksa rekursif jika nilai objek adalah objek
    const val1 = obj1[key];
    const val2 = obj2[key];
    const areEqual =
      typeof val1 === "object" && typeof val2 === "object"
        ? areObjectsEqual(val1, val2)
        : val1 === val2;

    // Jika nilai tidak sama, mengembalikan false
    if (!areEqual) {
      return false;
    }
  }

  // Jika tidak ada perbedaan ditemukan, mengembalikan true
  return true;
};

export {
  errorResponse,
  successResponse,
  validateIndonesianPhoneNumber,
  convertToIndonesianPhoneNumber,
  checkIsAllNullOrUndefined,
  generateRandomId,
  getPathFromFirebaseStorageUrl,
  areObjectsEqual,
};
