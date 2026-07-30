import { queryDatabase } from '../repositories/db.js';

export const getEmpresas = async (req, res) => {
    try {
        const empresas = await queryDatabase('SELECT * FROM EMPRESAS');
        return res.status(200).json(empresas);
    } catch (error) {
        console.error('Erro na consulta Firebird:', error);

        return res.status(500).json({ error: 'Erro ao buscar empresas no banco de dados.' });
    }
};