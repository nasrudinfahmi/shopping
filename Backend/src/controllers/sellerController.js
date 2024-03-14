import { generateRandomId } from "./../utils/utils.js";
import {
  createNewSeller,
  deleteSeller,
  getSeller,
} from "../services/sellerServices.js";
import { errorResponse, successResponse } from "./../utils/utils.js";

const createNewSellerController = async (req, res) => {
  try {
    const { storeName, address, phoneNumber, domain, email } = req.body;
    if (!req.body) throw new Error("Data tidak valid!");

    const datas = { storeName, address, phoneNumber, domain, email };

    for (const value of Object.values(datas)) {
      if (!value || value.trim() === "") throw new Error("Data tidak valid!");
    }

    const uids = generateRandomId();
    datas.uids = uids;
    await createNewSeller(datas);

    return successResponse(res, 201, "Berhasil buka toko", { data: datas });
  } catch (error) {
    let statusCode = 500;
    if (error.message === "Data tidak valid!") statusCode = 400;

    return errorResponse(res, statusCode, error.message);
  }
};

const getSellerController = async (req, res) => {
  try {
    const { uids } = req.query;
    if (!uids) throw new Error("Data tidak valid!");

    const sellerResponse = await getSeller(uids);
    if (!sellerResponse) throw new Error("UNAUHORIZED!");

    return successResponse(res, 200, "Berhasil mendapatkan data seller", {
      data: sellerResponse,
    });
  } catch (error) {
    let statusCode = 500;
    if (error.message === "Data tidak valid!") statusCode = 400;
    if (error.message === "UNAUHORIZED!") statusCode = 401;

    return errorResponse(res, statusCode, error.message);
  }
};

const deleteSellerController = async (req, res) => {
  try {
    const { uids } = req.query;
    if (!uids) throw new Error("Data tidak valid!");

    await deleteSeller(uids);

    return successResponse(res, 200, "Berhasil menghapus akun seller", {
      data: null,
    });
  } catch (error) {
    let statusCode = 500;
    if (error.message === "Data tidak valid!") statusCode = 400;
    if (error.message === "UNAUHORIZED!") statusCode = 401;

    return errorResponse(res, statusCode, error.message);
  }
};

export {
  createNewSellerController,
  getSellerController,
  deleteSellerController,
};
