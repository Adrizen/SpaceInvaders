import { getDB } from "../db";

interface Score {
  score: number;
}

// Obtiene y devuelve el puntaje de un usuario dado su nombre de usuario.
const getUserScore = (name: string) => {
  const db = getDB();
  let score: Score;

  try {
    score = db.getFirstSync(
      `
      SELECT s.score as score
      FROM User us
      INNER JOIN Score s ON us.id = s.userID
      WHERE us.name = ?;
      `,
      [name]
    );
  } catch (error) {
    console.log("Error en la obtención de la puntuación del usuario", error);
  } finally {
    db.closeSync();
  }

  return score as Score;
}

export default getUserScore;