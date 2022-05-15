import Utiitarios from '../util/Utilitarios.js'
import Block from "./Block.js";
import MongoConnection from "../models/BlockSchema.js"
import cryptoJs from 'crypto-js';

const util = new Utiitarios;

class Blockchain {
    constructor() {
        this.difficulty = 5;
    }

    addGenesisBlock(){
        new MongoConnection(this.createGenesisBlock())
        .save().catch((err) => { 
            console.log(`${new Date().toISOString()} : Erro ao criar Block Genesis: ${err}` )
        });
    }

    async verifyGenesisBlock(){
        const genesisFromDB = await this.getGenesisBlock().then((genesisBlock) => { return genesisBlock });
        if(genesisFromDB === null){
            return false;
        } else {
            return true;
        }
    }

    async getGenesisBlock() {
        return MongoConnection
            .find()
            .sort({ $natural: 1 })
            .limit(1)
            .then(
                function (doc) {
                    if (doc.length == 0){
                        return null;
                    } else {
                        return doc[0]._doc;
                    }
                },
                function (err) {
                    console.log(`${new Date().toISOString()} : Erro ao obter Block Genesis: ${err}` )
                }
            );
    }

    createGenesisBlock() {
        return new Block(0, "01/01/0001", "Genesis Block", "0");
    }

    async getLatestBlock() {
        return MongoConnection
            .find()
            .sort({ $natural: -1 })
            .limit(1)
            .then(
                function (doc) {
                    return doc[0]._doc;
                },
                function (err) {
                    console.log(`${new Date().toISOString()} : Erro ao obter útimo block no MongoDB: ${err}` )
                }
            );
    }

    async addBlock(newBlock) {

        newBlock.index = await this.getLatestBlock().then((block) => { return block.index + 1 });

        newBlock.previousHash = await this.getLatestBlock().then((block) => { return block.hash });

        newBlock.hash = newBlock.calculateHash();

        console.log(`${new Date().toISOString()} : Adicionando novo block...` )

        newBlock.mineBlock(this.difficulty);

        new MongoConnection(newBlock).save().then(()=>{
            console.log(`${new Date().toISOString()} : Block adicionado com sucesso. Hash: ${newBlock.hash}` )
        })
        .catch((err) => { 
            console.log(`${new Date().toISOString()} : Erro ao adicionar novo block: ${err}` )
        });
    }

    async isChainValid() {
        return await MongoConnection.find().then(async (documents) => {
            console.log(`${new Date().toISOString()} : Inciando validação de BlockChain...` )
            const realGenesis = this.createGenesisBlock();
            const genesisFromDB = documents[0]._doc

            if (realGenesis.hash !== genesisFromDB.hash) {
                console.log(`${new Date().toISOString()} : Block Genesis inválido.` )
                return false
            }

            for (let i = 1; i < documents.length; i++) {

                const currentDoc = documents[i]._doc
                const previousDoc = documents[i-1]._doc

                if (previousDoc.hash != currentDoc.previousHash) {
                    console.log(`${new Date().toISOString()} : BlockChain inválida. Hash do bloco ${currentDoc.index} não condiz com hash do bloco ${previousDoc.index}` )
                    return false
                }

                if (currentDoc.hash !== util.calculateHash256(currentDoc)) {
                    console.log(`${new Date().toISOString()} : BlockChain inválida. Hash do bloco ${currentDoc.index} não é válida}` )
                    return false
                }
            }
            console.log(`${new Date().toISOString()} : BlockChain é válida.` )
            console.log(`${new Date().toISOString()} : Finalizando validação de BlockChain com sucesso.` )
            return true;
        })
    }

    async getChainFromDB(){
        return await MongoConnection.find().lean().then(documents => {
            console.log(`${new Date().toISOString()} : Blockchain obtida com sucesso.` )
            return documents;
        })
    }
}

export default new Blockchain;