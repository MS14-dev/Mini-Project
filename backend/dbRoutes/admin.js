const database = require('../database');

const findAdmin =(userName)=>{
    return new Promise((resolve,reject)=>{
        database.query(`select * from admin where username = '${userName}'`,(err,row)=>{
            if(err){
                reject(err)
            }else{
                resolve(row)
            }
        })
    })
}

module.exports = {
    findAdmin,
}