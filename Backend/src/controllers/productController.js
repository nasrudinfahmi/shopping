import {
  errorResponse,
  generateRandomId,
  getPathFromFirebaseStorageUrl,
  successResponse,
} from "../utils/utils.js";
import {
  createNewProduct,
  deleteAllSellersProducts,
  getSellersProduct,
  updateProduct,
} from "../services/productServices.js";
import {
  productCollection,
  productFirestore,
} from "../lib/firebaseAdmin/services/firestore.js";
import { bucket, db } from "../lib/firebaseAdmin/init.js";

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

    const keyAllowNull = ["summary", "descriptions, qty"];
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

const updateProductController = async (req, res) => {
  try {
    if (!req.body) throw new Error("Data tidak valid!");

    const {
      uid,
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

    const datas = {
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
    let dataToUpdate = {};

    const keyAllowNull = ["summary", "descriptions, qty"];
    for (const [key, value] of Object.entries(datas)) {
      if (
        !keyAllowNull.includes(key) &&
        !value &&
        String(value).trim() === ""
      ) {
        throw new Error("Data tidak valid!");
      }

      if (keyAllowNull.includes(key)) {
        if (typeof value == "undefined") continue;
        if (!value && typeof value !== "undefined" && value == null) {
          dataToUpdate[key] = null;
        } else {
          dataToUpdate[key] = value;
        }
      }

      if (!keyAllowNull.includes(key) && value) {
        dataToUpdate[key] = value;
      }
    }

    await updateProduct(uid, dataToUpdate);

    return successResponse(res, 200, "Update Produk Berhasil");
  } catch (error) {
    let statusCode = 500;

    if (error.message === "Data tidak valid!") statusCode = 400;
    return errorResponse(res, statusCode, error.message);
  }
};

const getProductController = async (req, res) => {
  try {
    const { uid } = req.query;
    if (!uid) throw new Error("Data tidak valid!");

    const productResponse = await productFirestore(uid).get();
    const productsData = productResponse.data() || null;

    if (!productsData) throw new Error("Data tidak ditemukan!");

    return successResponse(res, 200, "Berhasil mendapatkan data produk", {
      data: productsData,
    });
  } catch (error) {
    let statusCode = 500;

    if (error.message === "Data tidak valid!") statusCode = 400;
    if (error.message === "Data tidak ditemukan!") statusCode = 404;
    return errorResponse(res, statusCode, error.message);
  }
};

const getProductsController = async (req, res) => {
  try {
    const productResponse = await db.collection("products").get();
    const products = productResponse.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));

    const productsData = products || null;

    if (!productsData) throw new Error("Data tidak ditemukan!");

    return successResponse(res, 200, "Berhasil mendapatkan data produk", {
      data: productsData,
    });
  } catch (error) {
    let statusCode = 500;

    if (error.message === "Data tidak ditemukan!") statusCode = 404;
    return errorResponse(res, statusCode, error.message);
  }
};

const deleteProductController = async (req, res) => {
  try {
    const { uid } = req.query;
    const { images } = req.body;

    if (!uid || !images) throw new Error("Data tidak valid!");

    await productFirestore(uid).delete();

    for (const img of images) {
      const pathName = getPathFromFirebaseStorageUrl(img);
      await bucket.file(pathName).delete();
    }

    return successResponse(res, 200, "Berhasil menghapus produk", {
      data: null,
    });
  } catch (error) {
    let statusCode = 500;

    if (error.message === "Data tidak valid!") statusCode = 400;
    if (error.message === "Data tidak ditemukan!") statusCode = 404;
    return errorResponse(res, statusCode, error.message);
  }
};

const getProductByNameController = async (req, res) => {
  try {
    const { productName } = req.body;
    if (!productName) throw new Error("Data tidak valid!");

    const productSnapshot = await productCollection().get();

    if (productSnapshot.empty) {
      throw new Error("Produk tidak ditemukan!");
    }

    let products = [];
    productSnapshot.docs.forEach((doc) => {
      const productName = doc.data().productName?.toLowerCase();
      const productWords = productName?.split(" ");

      productWords.forEach((word) => {
        console.log(req.body.productName.toLowerCase());
        if (req.body.productName.toLowerCase().includes(word)) {
          const isExistProduct = products.find(
            (product) => product.uid === doc.data().uid
          );
          if (!isExistProduct) products.push(doc.data());
        }
      });
    });

    return successResponse(res, 200, "Berhasil mendapatkan products", {
      data: {
        productLength: products.length,
        products: products,
      },
    });
  } catch (error) {
    let statusCode = 500;

    if (error.message === "Data tidak valid!") statusCode = 400;
    if (error.message === "Produk tidak ditemukan!") statusCode = 404;
    return errorResponse(res, statusCode, error.message);
  }
};

export {
  createNewProductController,
  getSellersProductsController,
  deleteAllSellersProductsController,
  getProductsController,
  updateProductController,
  getProductController,
  deleteProductController,
  getProductByNameController,
};
