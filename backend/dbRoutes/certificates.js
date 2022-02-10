const database = require('../database');

const addNewCertificate=(institution,hash,nic,certificate)=>{
    return new Promise((resolve,reject)=>{
      database.query(`insert into certificates values(?,?,?,?)`,[institution,hash,nic,certificate],(err,row)=>{
        if(err){
            reject(err)
        }else{
            resolve(row)
        }
      })
    })
}
module.exports = {
    addNewCertificate,
}