import { queryDatabase } from './db.js';

export async function findAll(limit, skip, search = '') {
    
    let query = 'SELECT FIRST ? SKIP ? ID, INSCRICAO_ESTADUAL, CNPJ, RAZAO_SOCIAL, REGIME_TRIBUTARIO, CNAE FROM EMPRESAS';
    const params = [limit, skip];

    if (search && search.trim() !== '') {
        const term = `%${search.trim().toUpperCase()}%`;

        query += ' WHERE UPPER(RAZAO_SOCIAL) LIKE ? OR CNPJ LIKE ?';
        params.push(term, term);
    }

    query += ' ORDER BY ID';
    
    const empresas = await queryDatabase(query, params);
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

export async function updateEmpresa(id, empresa) {
    const query = `
        UPDATE EMPRESAS 
        SET INSCRICAO_ESTADUAL = ?, 
            CNPJ = ?, 
            RAZAO_SOCIAL = ?, 
            REGIME_TRIBUTARIO = ?, 
            CNAE = ?
        WHERE ID = ?
    `;

    const result = await queryDatabase(query, [
        empresa.inscricaoEstadual,
        empresa.cnpj,
        empresa.razaoSocial,
        empresa.regimeTributario,
        empresa.cnae,
        id
    ]);

    return result;
}

export async function deleteEmpresa(id) {
    const query = 'DELETE FROM EMPRESAS WHERE ID = ?';
    return await queryDatabase(query, [id]);
}