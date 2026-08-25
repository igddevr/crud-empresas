import cors from 'cors';
import express from 'express';

import empresaRoutes from './routes/empresaRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/empresas', empresaRoutes);

app.listen(3000, () => {
    console.log('Servidor rodando na porta http://localhost:3000');
})