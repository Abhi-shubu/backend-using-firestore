import admin from 'firebase-admin';
import serviceAccount from '../config/serviceAccountKey.json';
import { ServiceAccount } from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
});

const firestore = admin.firestore();
export default firestore;
