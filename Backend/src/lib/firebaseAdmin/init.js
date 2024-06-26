import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import admin from "firebase-admin";

initializeApp({
  credential: cert({
    type: process.env.FIREBASE_CONFIG_TYPE,
    project_id: process.env.FIREBASE_CONFIG_PROJECT_ID,
    private_key_id: process.env.FIREBASE_CONFIG_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_CONFIG_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CONFIG_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CONFIG_CLIENT_ID,
    auth_uri: process.env.FIREBASE_CONFIG_AUTH_URI,
    token_uri: process.env.FIREBASE_CONFIG_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.FIREBASE_CONFIG_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CONFIG_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_CONFIG_UNIVERSE_DOMAIN,
  }),
  storageBucket: process.env.BUCKET_NAME,
});

const db = getFirestore();
const adminAuth = admin.auth();
const bucket = getStorage().bucket();

export { db, adminAuth, bucket };
