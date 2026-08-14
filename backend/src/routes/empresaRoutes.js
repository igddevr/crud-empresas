import { Router } from 'express';

import { getEmpresas } from '../controllers/empresaController.js';
import { getEmpresaById } from '../controllers/empresaController.js';
import { createEmpresa } from '../controllers/empresaController.js';
import { updateEmpresa } from '../controllers/empresaController.js';
import { deleteEmpresa } from '../controllers/empresaController.js';

const router = Router();

router.get('/', getEmpresas);
router.get('/:id', getEmpresaById);
router.post('/', createEmpresa);
router.put('/:id', updateEmpresa);
router.delete('/:id', deleteEmpresa);

export default router;