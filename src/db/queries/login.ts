import { getDB } from "../db";

interface User {
  id: number;
  name: string;
  password: string;
}

// Loguea al usuario. Si el usuario no existe devuelve null.
const loginUser = (name: string, password: string) => {
  const db = getDB();
  let user: User | undefined;
  
  try {
    user = db.getFirstSync(
      "SELECT * FROM User WHERE name = '" +
        name +
        "' AND password = '" +
        password +
        "';"
    );
  } catch (error) {
    console.log("Error en el logueo", error);
  } finally {
    db.closeSync();
  }
  return user;
};

export default loginUser;
