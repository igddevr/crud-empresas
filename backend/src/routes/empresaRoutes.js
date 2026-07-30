import { Router } from 'express';

import { getEmpresas } from '../controllers/empresaController.js';

const router = Router();

router.get('/', getEmpresas);

export default router;