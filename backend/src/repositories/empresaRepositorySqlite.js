import db from "../db-demo.js";

export const findAll = async (limit, skip, search) => {
  let query =
    "SELECT ID, RAZAO_SOCIAL, CNPJ, INSCRICAO_ESTADUAL, REGIME_TRIBUTARIO, CNAE FROM EMPRESAS";
  const params = [];

  if (search && search.trim() !== "") {
    query += " WHERE UPPER(RAZAO_SOCIAL) LIKE ? OR CNPJ LIKE ?";
    const term = `%${search.trim().toUpperCase()}%`;
    params.push(term, term);
  }

  query += " ORDER BY ID ASC LIMIT ? OFFSET ?";
  params.push(limit, skip);

  return db.prepare(query).all(...params);
};

export const findById = async (id) => {
  return db.prepare("SELECT * FROM EMPRESAS WHERE ID = ?").get(id) || null;
};

export const createEmpresa = async (dados) => {
  const stmt = db.prepare(`
    INSERT INTO EMPRESAS (RAZAO_SOCIAL, CNPJ, INSCRICAO_ESTADUAL, REGIME_TRIBUTARIO, CNAE)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    dados.razaoSocial || dados.RAZAO_SOCIAL,
    dados.cnpj || dados.CNPJ,
    dados.inscricaoEstadual || dados.INSCRICAO_ESTADUAL,
    dados.regimeTributario || dados.REGIME_TRIBUTARIO,
    dados.cnae || dados.CNAE,
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
    dados.razaoSocial || dados.RAZAO_SOCIAL,
    dados.cnpj || dados.CNPJ,
    dados.inscricaoEstadual || dados.INSCRICAO_ESTADUAL,
    dados.regimeTributario || dados.REGIME_TRIBUTARIO,
    dados.cnae || dados.CNAE,
    id,
  );
  return true;
};

export const deleteEmpresa = async (id) => {
  const stmt = db.prepare("DELETE FROM EMPRESAS WHERE ID = ?");
  stmt.run(id);
  return true;
};
