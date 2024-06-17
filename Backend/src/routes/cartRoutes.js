import express from "express";
import {
  addCartController,
  getUserCartController,
  deleteCartByUidsController,
  deleteProductsCartController,
  toggleCartsStatusController,
  editCartsQtyController,
  toggleAllCartsStatusController,
  deleteManyProductsCartController,
} from "../controllers/cartController.js";
import { checkToken } from "../middleware/checkToken.js";

const cartRoutes = express.Router();

cartRoutes.get("/get", checkToken, getUserCartController);
cartRoutes.post("/add", checkToken, addCartController);
cartRoutes.delete("/delete", checkToken, deleteCartByUidsController);
cartRoutes.delete("/delete/product", checkToken, deleteProductsCartController);
cartRoutes.delete(
  "/delete/products",
  checkToken,
  deleteManyProductsCartController
);
cartRoutes.patch("/update/status", checkToken, toggleCartsStatusController);
cartRoutes.patch("/update/qty", checkToken, editCartsQtyController);
cartRoutes.patch(
  "/update/status/all",
  checkToken,
  toggleAllCartsStatusController
);

export default cartRoutes;
