import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import admin from "firebase-admin";
import firebaseAdminConfig from "../../config/firebaseAdminConfig.js";

initializeApp({
  credential: cert(firebaseAdminConfig),
});

const db = getFirestore();
const adminAuth = admin.auth();

export { db, adminAuth };
