import express from "express";
import { addNewBlock } from '../controllers/BlockController.js'
import { getChainFromMongo } from "../controllers/BlockChainController.js";
import { isChainValid } from '../controllers/BlockChainController.js';

const router = express.Router();

router.post('/crypcom/block', addNewBlock)

router.get('/crypcom/blockchain', getChainFromMongo)

router.get('/crypcom/blockchain/validation', isChainValid )

export default router;