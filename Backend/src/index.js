import express from "express";
import "dotenv/config";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT;

const origin =
  process.env.IS_PRODUCTION === "true"
    ? process.env.PROD_URL
    : process.env.DEV_URL;

const corsOptions = {
  credentials: true,
  methods: "GET,PATCH,POST,DELETE",
  optionsSuccessStatus: 200,
  origin: [origin],
};

app.use(cors(corsOptions));
app.use(express.json());
app.get("/", (_req, res) => res.redirect(origin));
app.use("/data/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`);
});
