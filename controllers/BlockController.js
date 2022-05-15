import Block from '../commons/Block.js'
import Blockchain from "../commons/Blockchain.js"

export const addNewBlock = (req, res) => {
    try {
        const newBlock = new Block(0,new Date().toISOString(), req.body);
        
        Blockchain.addBlock(newBlock);

        res.send({ status: 200, message:"Block criado com sucesso." });
    } catch (error) {
        res.send({ status: 400, erro: error });
    }
}