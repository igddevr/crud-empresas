import { queryDatabase } from './db.js';

export async function findAll() {
    const empresas = await queryDatabase('SELECT * FROM EMPRESAS');
    return empresas;
}

export async function findById(id) {
    const result = await queryDatabase('SELECT * FROM EMPRESAS WHERE ID = ?', [id]);
    return result[0] || null;
}

export async function createEmpresa(empresa) {
    const genResult = await queryDatabase('SELECT GEN_ID(GEN_EMPRESAS_ID, 1) AS ID FROM RDB$DATABASE');
    const newId = genResult[0].ID;
    
    const insert = await queryDatabase(
        'INSERT INTO EMPRESAS (ID, INSCRICAO_ESTADUAL, CNPJ, RAZAO_SOCIAL, REGIME_TRIBUTARIO, CNAE) VALUES (?, ?, ?, ?, ?, ?)',
        [
            newId, 
            empresa.inscricaoEstadual, 
            empresa.cnpj, 
            empresa.razaoSocial, 
            empresa.regimeTributario, 
            empresa.cnae
        ]
    );
    return newId;
}