// backend/firebase.js
import admin from "firebase-admin";
import { readFileSync } from "fs";

// Load service account key
const serviceAccount = JSON.parse(
    readFileSync("./serviceAccountKey.json", "utf-8")
);

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Export Firestore and Auth
export const db = admin.firestore();
export const auth = admin.auth();
