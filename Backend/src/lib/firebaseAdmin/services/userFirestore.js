import { db } from "./../init.js";

const usersFirestore = (doc = null) => {
  const usersRef = db.collection("users").doc(doc);
  return usersRef;
};

export { usersFirestore };
