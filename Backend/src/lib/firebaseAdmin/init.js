import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import admin from "firebase-admin";
import config from "../../config/firebaseAdminConfig.js";

initializeApp({
  credential: cert({
    clientEmail: config.client_email,
    privateKey: config.private_key,
    projectId: config.project_id,
  }),
  storageBucket: process.env.BUCKET_NAME,
});

const db = getFirestore();
const adminAuth = admin.auth();
const bucket = getStorage().bucket();

export { db, adminAuth, bucket };
