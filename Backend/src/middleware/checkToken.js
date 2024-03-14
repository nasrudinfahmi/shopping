import { adminAuth } from "../lib/firebaseAdmin/init.js";

const checkToken = async (req, res, next) => {
  try {
    const idToken = req.header("Authorization")?.split("Bearer ")?.[1];
    if (!idToken) throw new Error("UNAUTHORIZED");

    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // token sudah kadaluarsa
    if (Date.now() > decodedToken.exp * 1000) {
      throw new Error("FORBIDDEN");
    }

    next();
  } catch (error) {
    let statusCode = 500;
    if (error.message === "UNAUTHORIZED") statusCode = 401;
    if (error.message === "FORBIDDEN") statusCode = 403;

    return res.sendStatus(statusCode);
  }
};

export { checkToken };
