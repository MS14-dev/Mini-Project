const {Schema,model} = require("mongoose");


const blockSchema=new Schema({
    index:{
        type:Number,
        min:1,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    data:{
        type:Object,
        required:true
    },
    preHash:{
        type:String,
        required:true
    },
    hash:{
        type:String,
        required:true
    },
})

const Block = model('block',blockSchema);
module.exports=Block;

// const SHA256 = require('crypto-js/sha256'); 

// class Block {
//     constructor(index,date,data,preHash = ''){
//         this.index = index;
//         this.date = date;
//         this.data = data;
//         this.preHash = preHash;
//         this.hash = this.calculateHash()
//     }
//     calculateHash=()=>{
//         return SHA256(this.index+this.preHash+this.date+JSON.stringify(this.data).toString()).toString();
//     }
// }

// module.exports = Block;