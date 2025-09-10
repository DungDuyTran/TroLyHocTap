// // lib/firebaseAdmin.ts
// import * as admin from "firebase-admin";

// const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert({
//       projectId: process.env.FIREBASE_PROJECT_ID,
//       clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//       privateKey,
//     }),
//     storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // không cần NEXT_PUBLIC
//   });
// }

// export const adminAuth = admin.auth();
// export const adminDb = admin.firestore();
// export const adminStorage = admin.storage();
