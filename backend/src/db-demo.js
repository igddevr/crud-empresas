import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbDir = path.resolve(__dirname, '..');
const dbPath = path.join(dbDir, 'demo.db');

const rawDb = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados SQLite:", err.message);
  }
});

rawDb.serialize(() => {
  rawDb.run(`
    CREATE TABLE IF NOT EXISTS EMPRESAS (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      RAZAO_SOCIAL TEXT NOT NULL,
      CNPJ TEXT NOT NULL UNIQUE,
      INSCRICAO_ESTADUAL TEXT NOT NULL,
      REGIME_TRIBUTARIO TEXT NOT NULL,
      CNAE TEXT NOT NULL
    )
  `);

rawDb.get('SELECT COUNT(*) as count FROM EMPRESAS', (err, row) => {
    if (!err && row && row.count === 0) {
      const stmt = rawDb.prepare(`
        INSERT INTO EMPRESAS (RAZAO_SOCIAL, CNPJ, INSCRICAO_ESTADUAL, REGIME_TRIBUTARIO, CNAE)
        VALUES (?, ?, ?, ?, ?)
      `);

  const empresasIniciais = [
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

  for (const emp of empresasIniciais) {
        stmt.run(emp);
      }
      stmt.finalize();
      console.log('Base demo SQLite inicializada com sucesso!');
    }
  });
});

const db = {
  prepare(sql) {
    return {
      all(...params) {
        return new Promise((resolve, reject) => {
          rawDb.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
          });
        });
      },
      get(...params) {
        return new Promise((resolve, reject) => {
          rawDb.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row || null);
          });
        });
      },
      run(...params) {
        return new Promise((resolve, reject) => {
          rawDb.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ lastInsertRowid: this.lastID, changes: this.changes });
          });
        });
      }
    };
  }
};

export default db;