import customMongoose from "mongoose";

customMongoose.Promise = global.Promise;

customMongoose.connect('mongodb://localhost/crypcom').then(()=>{
    console.log(`${new Date().toISOString()} : Conexão com MongoDb executada com sucesso.` )
}).catch((err) =>{
    console.log(`${new Date().toISOString()} : Erro ao conectar com MongoDB: ${err}` )
});

const BlockSchema = new customMongoose.Schema({
    index: {
        type: Number,
        required: true
    },
    timestamp: {
        type : String,
        required: true
    },
    data: {
        type: Object,
        required: true,
    },
    hash:{
        type: String,
        required: true
    },
    previousHash: {
        type: String,
        required: true
    },
    nonce: {
        type: Number,
        required: false
    }
},{ versionKey: false })

customMongoose.model("blocks", BlockSchema);

const BlockModel = customMongoose.model('blocks')

export default BlockModel;