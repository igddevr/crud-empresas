import db from "../db-demo.js";

export const findAll = async (limit, skip, search) => {
  let query =
    "SELECT ID, RAZAO_SOCIAL, CNPJ, INSCRICAO_ESTADUAL, REGIME_TRIBUTARIO, CNAE FROM EMPRESAS";
  const params = [];

  if (search) {
    query += " WHERE RAZAO_SOCIAL LIKE ? OR CNPJ LIKE ?";
    params.push(`%${search}%`, `%${search}%`);
  }

  query += " ORDER BY ID DESC LIMIT ? OFFSET ?";
  params.push(limit, skip);

  const rows = db.prepare(query).all(...params);

  return rows.map((row) => ({
    id: row.ID,
    razaoSocial: row.RAZAO_SOCIAL,
    cnpj: row.CNPJ,
    inscricaoEstadual: row.INSCRICAO_ESTADUAL,
    regimeTributario: row.REGIME_TRIBUTARIO,
    cnae: row.CNAE,
  }));
};

export const findById = async (id) => {
  const row = db
    .prepare(
      "SELECT ID, RAZAO_SOCIAL, CNPJ, INSCRICAO_ESTADUAL, REGIME_TRIBUTARIO, CNAE FROM EMPRESAS WHERE ID = ?",
    )
    .get(id);
  if (!row) return null;

  return {
    id: row.ID,
    razaoSocial: row.RAZAO_SOCIAL,
    cnpj: row.CNPJ,
    inscricaoEstadual: row.INSCRICAO_ESTADUAL,
    regimeTributario: row.REGIME_TRIBUTARIO,
    cnae: row.CNAE,
  };
};

export const createEmpresa = async (dados) => {
  const stmt = db.prepare(`
    INSERT INTO EMPRESAS (RAZAO_SOCIAL, CNPJ, INSCRICAO_ESTADUAL, REGIME_TRIBUTARIO, CNAE)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    dados.razaoSocial,
    dados.cnpj,
    dados.inscricaoEstadual,
    dados.regimeTributario,
    dados.cnae,
  );
  return info.lastInsertRowid;
};

export const updateEmpresa = async (id, dados) => {
  const stmt = db.prepare(`
    UPDATE EMPRESAS 
    SET RAZAO_SOCIAL = ?, CNPJ = ?, INSCRICAO_ESTADUAL = ?, REGIME_TRIBUTARIO = ?, CNAE = ?
    WHERE ID = ?
  `);
  stmt.run(
    dados.razaoSocial,
    dados.cnpj,
    dados.inscricaoEstadual,
    dados.regimeTributario,
    dados.cnae,
    id,
  );
  return true;
};

export const deleteEmpresa = async (id) => {
  const stmt = db.prepare("DELETE FROM EMPRESAS WHERE ID = ?");
  stmt.run(id);
  return true;
};
