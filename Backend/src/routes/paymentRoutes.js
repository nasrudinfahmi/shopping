import express from "express";
import { errorResponse, successResponse } from "../utils/utils.js";
import snap from "../config/midtrans.Config.js";

const paymentRoutes = express.Router();

const MIDTRANS_URL = "https://app.sandbox.midtrans.com/snap/v1/transactions";

paymentRoutes.post("/pay", async (req, res) => {
  try {
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    // const authString = Buffer.from(`${serverKey}:`).toString("base64");
    const authString = btoa(`${serverKey}:`);
    const authHeader = "Basic " + authString;

    const parameter = {
      transaction_details: {
        order_id: "order-id-123",
        gross_amount: 10000,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: "budi",
        last_name: "pratama",
        email: "budi.pra@example.com",
        phone: "08111222333",
      },
    };

    const response = await fetch(MIDTRANS_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(parameter),
    });

    const data = await response.json();
    console.log(data);

    // const transaction = await snap.createTransaction(parameter);
    // let transactionToken = transaction.token;
    // console.log("transactionToken:", transactionToken);

    return successResponse(res, 201, "berhasil melakukan pembayaran", {
      data: null,
    });
  } catch (error) {
    console.log(error.message);
    return errorResponse(res, 500, "Gagal dalam melakukan pembayaran.");
  }
});

export default paymentRoutes;
