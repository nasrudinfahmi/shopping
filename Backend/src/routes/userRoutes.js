import express from "express";
import {
  createNewDocUser,
  deleteDocUser,
  getDocUser,
  updateDocUser,
} from "../controllers/userController.js";
import { checkToken } from "../middleware/checkToken.js";

const userRoutes = express.Router();

userRoutes.get("/get", checkToken, getDocUser);
userRoutes.post("/create", checkToken, createNewDocUser);
userRoutes.patch("/update", checkToken, updateDocUser);
userRoutes.delete("/delete", checkToken, deleteDocUser);

export default userRoutes;
