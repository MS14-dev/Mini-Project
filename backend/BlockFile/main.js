const BlockChain = require('./BlockChain')
const hash = require('object-hash')

let blockChain = new BlockChain()

let PROOF = 1560;

let validProof= (proof)=>{
    let guestHash = hash(proof)
    return guestHash == hash(PROOF)
}

let proofOfWork=()=>{
    let proof = 0;
    while(true){
        if(!validProof(proof)){
            proof++
        }else{
            break;
        }
    }
    return proof;
}

if(proofOfWork() == PROOF){
    blockChain.addNewTransaction("hawa","ibba",200)
    let prevHash = blockChain.lastBlock() ? blockChain.lastBlock.hash : null
    blockChain.addNewBlock(prevHash)
}