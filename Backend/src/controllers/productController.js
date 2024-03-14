import {
  errorResponse,
  generateRandomId,
  successResponse,
} from "../utils/utils.js";
import {
  createNewProduct,
  deleteAllSellersProducts,
  getSellersProduct,
} from "../services/productServices.js";

const createNewProductController = async (req, res) => {
  try {
    if (!req.body) throw new Error("Data tidak valid!");
    const {
      uids,
      productName,
      price,
      summary,
      delivery,
      brand,
      status,
      qty,
      thumbProduct,
      imgs,
      tagVariations,
      descriptions,
    } = req.body;

    const uid = generateRandomId();
    let datas = {
      uid,
      uids,
      productName,
      price,
      summary,
      delivery,
      brand,
      status,
      qty,
      thumbProduct,
      imgs,
      tagVariations,
      descriptions,
    };

    const keyAllowNull = ["summary", "tagVariations", "descriptions, qty"];
    for (const [key, value] of Object.entries(datas)) {
      if (
        !keyAllowNull.includes(key) &&
        !value &&
        String(value).trim() === ""
      ) {
        throw new Error("Data tidak valid!");
      }

      if (keyAllowNull.includes(key)) {
        if (!value || String(value).trim() === "") {
          datas[key] = null;
        }
      }
    }

    await createNewProduct(datas);

    return successResponse(res, 201, "Berhasil menambahkan produk baru.", {
      data: datas,
    });
  } catch (error) {
    let statusCode = 500;

    if (error.message === "Data tidak valid!") statusCode = 400;
    return errorResponse(res, statusCode, error.message);
  }
};

const getSellersProductsController = async (req, res) => {
  try {
    const { uids } = req.query;
    if (!uids) throw new Error("Data tidak valid!");

    const products = await getSellersProduct(uids);

    if (!products) throw new Error("Produk tidak ditemukan.");

    return successResponse(res, 200, "Berhasil mendapatkan sellers products", {
      data: products,
    });
  } catch (error) {
    let statusCode = 500;

    if (error.message === "Data tidak valid!") statusCode = 400;
    if (error.message === "Produk tidak ditemukan.") statusCode = 404;
    return errorResponse(res, statusCode, error.message);
  }
};

const deleteAllSellersProductsController = async (req, res) => {
  try {
    const { uids } = req.query;
    if (!uids) throw new Error("Data tidak valid!");

    await deleteAllSellersProducts(uids);

    return successResponse(res, 200, "Berhasil menghapus semua produk seller", {
      data: null,
    });
  } catch (error) {
    let statusCode = 500;

    if (error.message === "Data tidak valid!") statusCode = 400;
    return errorResponse(res, statusCode, error.message);
  }
};

export {
  createNewProductController,
  getSellersProductsController,
  deleteAllSellersProductsController,
};
