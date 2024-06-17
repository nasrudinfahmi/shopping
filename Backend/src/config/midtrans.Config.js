import midtransClient from "midtrans-client";

const isProduction = process.env.IS_PRODUCTION === "true" ? true : false;

const snap = new midtransClient.Snap({
  isProduction,
  serverKey: process.env.MIDTRANS_CLIENT_KEY,
  clientKey: process.env.MIDTRANS_SERVER_KEY,
});

export default snap;
