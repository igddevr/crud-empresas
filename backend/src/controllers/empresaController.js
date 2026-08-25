import { findAll, findById, createEmpresa as createEmpresaRepo, updateEmpresa as updateEmpresaRepo, deleteEmpresa as deleteEmpresaRepo } from '../repositories/empresaRepositoryService.js';

export const getEmpresas = async (req, res) => {
    try {
        
        const { page = 1, limit = 20, search } = req.query;

        const pageCount = parseInt(page);
        const limitCount = parseInt(limit);

        const skipCount = (pageCount - 1) * limitCount;

        const empresas = await findAll(limitCount, skipCount, search);
        
        return res.status(200).json({
            "page": pageCount,
            "limit": limitCount,
            "search": search,
            "data": empresas
        });
    
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

export async function updateEmpresa(req, res) {
    try {
        const { id } = req.params;
        const empresaData = req.body;

        const empresaExistente = await findById(id);
        if (!empresaExistente) {
            return res.status(404).json({ message: "Empresa não encontrada." });
        }

        await updateEmpresaRepo(id, empresaData);

        return res.status(200).json({ 
            message: "Empresa atualizada com sucesso.",
            id: Number(id)
        });
    } catch (error) {
        console.error("Erro ao atualizar empresa:", error);
        return res.status(500).json({ error: "Erro interno ao atualizar empresa." });
    }
}

export async function deleteEmpresa(req, res) {
    try {
        const { id } = req.params;

        const empresaExistente = await findById(id);
        if (!empresaExistente) {
            return res.status(404).json({ message: "Empresa não encontrada." });
        }

        await deleteEmpresaRepo(id);

        return res.status(200).json({ message: "Empresa removida com sucesso." });
    } catch (error) {
        console.error("Erro ao deletar empresa:", error);
        return res.status(500).json({ error: "Erro interno ao deletar empresa." });
    }
}