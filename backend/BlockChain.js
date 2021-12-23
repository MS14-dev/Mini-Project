const Block = require('./Block');

class BlockChain{

    constructor(){
        this.chain = [this.createMashBlock()];
    }
    createMashBlock=()=>{
        return new Block(0,"24/11/2021","Mash Block",'0');
    }
    getLatestBlock=()=>{
        return this.chain[this.chain.length - 1];
    }
    addBlock=(newBlock)=>{
        newBlock.preHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
    isChainValid=()=>{
        for(let i = 1; i < this.chain.length; i++ ){
            const currentBlock = this.chain[i]
            const preBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            if(currentBlock.preHash !== preBlock.calculateHash()){
                return false
            }

        }
        return true;
    }
}

module.exports = BlockChain