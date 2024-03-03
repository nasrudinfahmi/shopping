import { FieldValue } from "firebase-admin/firestore";
import { usersFirestore } from "../lib/firebaseAdmin/services/userFirestore.js";
import {
  checkIsAllNullOrUndefined,
  convertToIndonesianPhoneNumber,
  errorResponse,
  successResponse,
  validateIndonesianPhoneNumber,
} from "../utils/utils.js";

const createNewDocUser = async (req, res) => {
  try {
    const { email, displayName, photoURL, uid, emailVerified, phoneNumber } =
      req.body;

    if (!req.body) {
      throw new Error("Data tidak valid!");
    }

    const datas = {
      email,
      displayName,
      photoURL,
      uid,
      emailVerified,
      phoneNumber,
    };

    // cek apakah semua value undefined atau null
    const isInvalidData = checkIsAllNullOrUndefined(datas);
    if (isInvalidData) throw new Error("Data tidak valid!");

    let convertedPhoneNumber = null;
    if (phoneNumber) {
      const isPhoneNumberValid = validateIndonesianPhoneNumber(phoneNumber);

      if (!isPhoneNumberValid) throw new Error("Nomor telepon tidak valid!");

      convertedPhoneNumber = convertToIndonesianPhoneNumber(phoneNumber);
    }

    const userData = {
      uid,
      displayName,
      email,
      photoURL,
      phoneNumber: convertedPhoneNumber,
      role: "user",
      emailVerified,
      cretaedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await usersFirestore(email).create(userData);

    return successResponse(res, 201, "Berhasil menyimpan data user", userData);
  } catch (error) {
    let statusCode = 500;

    if (
      error.message === "Data tidak valid!" ||
      error.message === "Nomor telepon tidak valid!"
    ) {
      statusCode = 400;
    }
    return errorResponse(res, statusCode, error.message);
  }
};

const getDocUser = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email || email.trim() === "") throw new Error("Email tidak valid!");
    const userData = await usersFirestore(email).get();

    const dataUser = userData.data() || null;

    const data = { userData: dataUser };

    if (dataUser) {
      return successResponse(res, 200, "berhasil mendapatkan data user", {
        data,
      });
    } else {
      throw new Error("Data user tidak ditemukan.");
    }
  } catch (error) {
    let statusCode = 500;
    if (error.message === "Email tidak valid!") statusCode = 400;
    if (error.message === "Data user tidak ditemukan.") statusCode = 404;

    return errorResponse(res, statusCode, error.message);
  }
};

const updateDocUser = async (req, res) => {
  try {
    const { email } = req.query;
    const { displayName, photoURL, role, emailVerified } = req.body;
    if (!email || email.trim() === "")
      throw new Error("Masukkan email untuk update data!");

    if (
      (!displayName || displayName.trim() === "") &&
      (!photoURL || photoURL.trim() === "") &&
      (!role || role.trim() === "") &&
      (emailVerified === null || emailVerified === undefined)
    ) {
      throw new Error("Data tidak valid!");
    }

    const datas = { displayName, photoURL, role, emailVerified };
    let dataToUpdate = {};

    for (const [key, value] of Object.entries(datas)) {
      if (typeof value === "string" && value.trim() !== "") {
        dataToUpdate[key] = value.trim();
      }

      if (typeof value === "boolean") {
        dataToUpdate[key] = emailVerified;
      }
    }

    if (Object.keys(dataToUpdate).length === 0) {
      throw new Error("Data tidak valid!");
    } else {
      await usersFirestore(email).update(dataToUpdate);
    }

    return successResponse(res, 200, "Berhasil memperbarui data user", {
      data: dataToUpdate,
    });
  } catch (error) {
    let statusCode = 500;

    if (
      error.message === "Data tidak valid!" ||
      error.message === "Masukkan email untuk update data!"
    ) {
      statusCode = 400;
    }

    return errorResponse(res, statusCode, error.message);
  }
};

const deleteDocUser = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || email.trim() === "") throw new Error("Email tidak valid!");

    await usersFirestore(email).delete();

    return successResponse(res, 200, "Berhasil menghapus data user", {
      data: null,
    });
  } catch (error) {
    let statusCode = 500;
    if (error.message === "Email tidak valid!") statusCode = 400;

    return errorResponse(res, statusCode, error.message);
  }
};

export { createNewDocUser, getDocUser, updateDocUser, deleteDocUser };
