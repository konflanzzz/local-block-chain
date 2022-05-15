import Blockchain from '../commons/Blockchain.js'

export const isChainValid = async (req, res) => {
    await Blockchain.isChainValid().then((isValid)=>{
        res.send({ status: 200, isChainValid:isValid });
    }).catch((err) => {
        res.send({ status: 400, erro: err });
    })
}

export const getChainFromMongo = async (req, res) => {

    console.log(`${new Date().toISOString()} : Buscando Blockchain no banco de dados...` )
    
    await Blockchain.getChainFromDB().then((documents)=>{
        res.send({ status: 200, blockchain: documents });
    }).catch((err) => {
        res.send({ status: 400, erro: err });
    })

}

export const verifyGenesisBlock = async () => {
    Blockchain.verifyGenesisBlock().then((exists)=> {
        if (!exists){
            console.log(`${new Date().toISOString()} : Block Genesis não encontrado no banco de dados.` )
            console.log(`${new Date().toISOString()} : Criando Block Genesis padrão...` )
            Blockchain.addGenesisBlock()
            console.log(`${new Date().toISOString()} : Block Genesis criado com sucesso.` )
        } else {
            console.log(`${new Date().toISOString()} : Block Genesis já existe no banco de dados.` )
        }
    })
}