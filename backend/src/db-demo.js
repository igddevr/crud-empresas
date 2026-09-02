import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, "demo.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS EMPRESAS (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    RAZAO_SOCIAL TEXT NOT NULL,
    CNPJ TEXT NOT NULL,
    INSCRICAO_ESTADUAL TEXT,
    REGIME_TRIBUTARIO TEXT,
    CNAE TEXT
  )
`);

const count = db.prepare("SELECT COUNT(*) as total FROM EMPRESAS").get().total;

if (count === 0) {
  const insert = db.prepare(`
    INSERT INTO EMPRESAS (RAZAO_SOCIAL, CNPJ, INSCRICAO_ESTADUAL, REGIME_TRIBUTARIO, CNAE)
    VALUES (?, ?, ?, ?, ?)
  `);

  const empresasExemplo = [
    [
      "TECH SOLUTIONS BRASIL LTDA",
      "12345678000190",
      "1029384756",
      "N",
      "6201-5/01",
    ],
    [
      "COMERCIO DE ALIMENTOS MINAS S.A.",
      "98765432000109",
      "9876543210",
      "H",
      "4711-3/02",
    ],
    [
      "INOVACAO & DESIGN DIGITAL ME",
      "45678912000134",
      "5647382910",
      "N",
      "7410-2/02",
    ],
    [
      "LOGISTICA EXPRESS SUL EIRELI",
      "78912345000167",
      "3495820193",
      "H",
      "4930-2/02",
    ],
    [
      "AUTO PECAS CENTRAL LTDA",
      "32165498000121",
      "8374619284",
      "N",
      "4530-7/03",
    ],
  ];

  const insertMany = db.transaction((empresas) => {
    for (const emp of empresas) insert.run(...emp);
  });

  insertMany(empresasExemplo);
  console.log("Base demo SQLite inicilizada com sucesso!");
}

export default db;
