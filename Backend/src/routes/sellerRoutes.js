import express from "express";
import {
  createNewSellerController,
  deleteSellerController,
  getSellerController,
} from "../controllers/sellerController.js";
import { checkToken } from "../middleware/checkToken.js";

const sellerRoutes = express.Router();

sellerRoutes.post("/create", checkToken, createNewSellerController);
sellerRoutes.get("/get", getSellerController);
sellerRoutes.delete("/delete", checkToken, deleteSellerController);

export default sellerRoutes;
