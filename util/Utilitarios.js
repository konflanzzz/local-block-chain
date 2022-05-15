import cryptoJs from 'crypto-js' ;

class Utiitarios {
    
    calculateHash256(block) {
        return cryptoJs.SHA256(
            block.index + 
            block.previousHash + 
            block.timestamp + 
            JSON.stringify(block.data) + block.nonce)
            .toString()
    }

}

export default Utiitarios