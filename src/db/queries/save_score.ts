import { getDB } from "../db";

interface CurrentScore {
  score: number;
}

// Guarda el puntaje del usuario.
export const saveScore = (name: string, newScore: number) => {
  const db = getDB();
  try {
    // Consultar si el puntaje nuevo es mejor que el actual guardado para ese usuario.
    const currentScore: CurrentScore = db.getFirstSync(
      "SELECT score FROM Score WHERE userID = (SELECT id FROM User WHERE name = '" +
        name +
        "');"
    );

    // Si el puntaje nuevo es mejor, actualizarlo.
    if (newScore > currentScore.score) {
      db.execSync(
        "UPDATE Score SET score = " +
          newScore +
          " WHERE userID = (SELECT id FROM User WHERE name = '" +
          name +
          "');"
      );
    }
  } catch (error) {
    console.log("Error en la actualización del puntaje", error);
  } finally {
    db.closeSync();
  }
};
