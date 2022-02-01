const SHA256 = require('crypto-js/sha256'); 

class Block {
    constructor(index,date,data,preHash = ''){
        this.index = index;
        this.date = date;
        this.data = data;
        this.preHash = preHash;
        this.hash = this.calculateHash()
    }
 
    calculateHash=()=>{
        return SHA256(this.index+this.preHash+this.date+JSON.stringify(this.data).toString()).toString();
    }
}

module.exports = Block;