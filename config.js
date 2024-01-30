import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBf3CUOitwA2P34wZ9NibxE0Wj73GuG94Q",
  authDomain: "buddy-score.firebaseapp.com",
  projectId: "buddy-score",
  storageBucket: "buddy-score.appspot.com",
  messagingSenderId: "197292629079",
  appId: "1:197292629079:web:c55825d3892d77046e9712",
  measurementId: "G-CX6Y4JC72K"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

const getUsersWithImages = async () => {
  const usersCollection = collection(firestore, 'users');
  const usersSnapshot = await getDocs(usersCollection);
  return usersSnapshot.docs.map(doc => ({
    name: doc.data().name,
    image: doc.data().image,
  }));
};

export { app, auth, firestore, storage, getUsersWithImages };