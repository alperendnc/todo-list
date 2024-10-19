import { createContext } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection, addDoc } from "firebase/firestore";
import { firebaseConfig } from "../config";

const APP = initializeApp(firebaseConfig);

const DB = getFirestore(APP);

const FirebaseContext = createContext({
  getTodos: Promise.resolve(),
  addTodo: Promise.resolve(),
  deleteTodo: Promise.resolve(),
});
const FirebaseProvider = ({ children }) => {
  const getTodos = async () => {
    const collectionRef = collection(DB, "todos");
    const snapshot = await getDocs(collectionRef);

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  const addTodo = async (newTodo) => {
    const collectionRef = collection(DB, "todos");
    await addDoc(collectionRef, newTodo);
  };

  return (
    <FirebaseContext.Provider value={{ getTodos, addTodo }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export { FirebaseContext, FirebaseProvider };
