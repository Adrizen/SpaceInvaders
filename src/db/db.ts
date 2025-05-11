import * as SQLite from "expo-sqlite";

const getDB = () => {
  let db = SQLite.openDatabaseSync("databaseName");
  return db;
};

const initDB = async () => {
  const db = getDB();

  // Crear las tablas 'User' y 'Score'.
  try {
    db.execSync(`
      DROP TABLE User;    -- <-- ESTO SE PUEDE COMENTAR PARA EVITAR QUE LAS TABLAS SE BORREN
      CREATE TABLE IF NOT EXISTS User (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          name TEXT, 
          password TEXT
      );
      PRAGMA journal_mode = WAL;
  
      INSERT INTO User (name, password) VALUES ('Andy', 'andy123');
      INSERT INTO User (name, password) VALUES ('Fabio', 'fabio123');
      
      DROP TABLE Score;   -- <-- ESTO SE PUEDE COMENTAR PARA EVITAR QUE LAS TABLAS SE BORREN
      CREATE TABLE IF NOT EXISTS Score (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userID INTEGER,
          score INTEGER NOT NULL,
          FOREIGN KEY (userID) REFERENCES User(id) ON DELETE CASCADE
      );
  
      INSERT INTO Score (userID, score) VALUES (1, 0);
      INSERT INTO Score (userID, score) VALUES (2, 0);
    `);
  } catch (error) {
    console.log("Error al inicializar la base de datos", error);
  } finally {
    db.closeSync();
  }


};

export { initDB, getDB };
