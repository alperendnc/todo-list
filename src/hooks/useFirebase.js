import { useContext } from "react";
import { FirebaseContext } from "../contexts/FirebaseContext";

const useFirebase = () => {
  return useContext(FirebaseContext);
};

export default useFirebase;
