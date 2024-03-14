import express from "express";
import {
  createNewProductController,
  deleteAllSellersProductsController,
  getSellersProductsController,
} from "../controllers/productController.js";
import { checkToken } from "../middleware/checkToken.js";

const productRoutes = express.Router();

productRoutes.post("/create", checkToken, createNewProductController);
productRoutes.get("/get/s", checkToken, getSellersProductsController);
productRoutes.delete(
  "/delete/s",
  checkToken,
  deleteAllSellersProductsController
);

export default productRoutes;
