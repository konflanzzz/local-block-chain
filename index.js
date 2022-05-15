import express from 'express';
import bodyParser from 'body-parser';
import {verifyGenesisBlock} from './controllers/BlockChainController.js';

import router from './routes/CrypCom.js';

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

app.use('/', router)
app.get('/', (req, res) => res.send('[CRYPCOM API]'))

app.listen(PORT, () => {
    verifyGenesisBlock();
    console.log(`${new Date().toISOString()} : Iniciando servidor @ http://localhost:${PORT}`)
})