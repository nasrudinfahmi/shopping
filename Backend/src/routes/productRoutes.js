import express from "express";
import {
  createNewProductController,
  deleteAllSellersProductsController,
  deleteProductController,
  getProductByNameController,
  getProductController,
  getProductsController,
  getSellersProductsController,
  updateProductController,
} from "../controllers/productController.js";
import { checkToken } from "../middleware/checkToken.js";

const productRoutes = express.Router();

productRoutes.post("/create", checkToken, createNewProductController);
productRoutes.get("/get/all", getProductsController);
productRoutes.get("/get/s", checkToken, getSellersProductsController);
productRoutes.delete(
  "/delete/s",
  checkToken,
  deleteAllSellersProductsController
);
productRoutes.patch("/update", checkToken, updateProductController);
productRoutes.get("/get", checkToken, getProductController);
productRoutes.get("/get/search", getProductByNameController);
productRoutes.delete("/delete", checkToken, deleteProductController);

export default productRoutes;
