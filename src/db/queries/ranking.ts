import { getDB } from "../db";

interface rankingData {
  id: number;
  name: string;
  score: number;
}

// Obtiene y devuelve los datos de todos los usuarios y sus puntajes.
const getRankingData = () => {
  const db = getDB();
  let allRows: rankingData[];

  try {
    allRows = db.getAllSync(
    `
    SELECT u.id, u.name, s.score
    FROM User u
    INNER JOIN Score s ON u.id = s.userID;
    `
    );
  } catch (error) {
    console.log("Error en la obtención de datos del ranking", error);
  } finally {
    db.closeSync();
  }

  return allRows as { id: number; name: string; score: number }[]; // Para evitar errores de TS.
};

export default getRankingData;
