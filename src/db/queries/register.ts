import { getDB } from "../db";
import { Alert } from "react-native";
import { useTranslation } from "react-i18next";

interface NewUser {
  id: number;
}

// Registra un nuevo usuario.
const registerUser = (name: string, password: string) => {
  const { t } = useTranslation(); // Traducción de textos.

  const db = getDB();
  let  success: Boolean;

  // Buscar si el usuario ya existe.
  try {
    const user = db.getFirstSync(
      "SELECT * FROM User WHERE name = '" + name + "';"
    );

    // Si el usuario no existe, registrarlo.
    if (!user) {
      db.execSync(
        "INSERT INTO User (name, password) VALUES ('" +
          name +
          "', '" +
          password +
          "');"
      );

      // Buscar el id del usuario creado.
      const newUser: NewUser = db.getFirstSync(
        "SELECT id FROM User WHERE name = '" + name + "';"
      );

      // Crear fila en la tabla Score con el id del usuario y score 0.
      db.execSync(
        "INSERT INTO Score (userID, score) VALUES (" + newUser.id + ", 0);"
      );

      success = true;

    } else {
      Alert.alert("Error", t('usernameAlreadyExists') );
      success = false;
    }
  } catch (error) {
    console.log("Error en el registro de un usuario nuevo", error);
  } finally {
    db.closeSync();
    return success;
  }
};

export default registerUser;
