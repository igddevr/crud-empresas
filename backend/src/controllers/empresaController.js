import { findAll, findById, createEmpresa as createEmpresaRepo } from '../repositories/empresaRepositoryService.js';

export const getEmpresas = async (req, res) => {
    try {
        const empresas = await findAll();
        return res.status(200).json(empresas);
    } catch (error) {
        console.error('Erro na consulta Firebird:', error);

        return res.status(500).json({ 
            error: 'Erro ao buscar empresas no banco de dados.' 
        });
    }
};

export const getEmpresaById = async (req, res) => {
        
    const { id } = req.params;

    try {
        const empresa = await findById(id);
        if (!empresa) {
            return res.status(404).json({ 
                message: 'Empresa não encontrada.' 
            });
        }
        return res.status(200).json(empresa);
    } catch (error) {
        console.error('Erro na consulta Firebird:', error);

        return res.status(500).json({ 
            error: 'Erro ao buscar empresa no banco de dados.' 
        });
    }
};

export const createEmpresa = async (req, res) => {
    const { inscricaoEstadual, cnpj, razaoSocial, regimeTributario, cnae } = req.body;

    if (!inscricaoEstadual || !cnpj || !razaoSocial || !regimeTributario || !cnae) {
        return res.status(400).json({
            error: 'Todos os campos são obrigatórios.'
        });
    }

    try {
        const newEmpresa = await createEmpresaRepo({
            inscricaoEstadual,
            cnpj,
            razaoSocial,
            regimeTributario,
            cnae
        });

        return res.status(201).json({
            message: 'Empresa criada com sucesso.',
            id: newEmpresa
        });
    } catch (error) {
        console.error('Erro ao criar empresa:', error);
        return res.status(500).json({
            error: 'Erro ao criar empresa no banco de dados.'
        });
    };
};