const database = require('../database');
const {SHA256} = require('crypto-js')

//add new cerificate
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

//verification of the certificate
//get all the certificates by particular student NIC
const getCerificatesByNIC=(nic)=>{
    return new Promise((resolve,reject)=>{
       database.query('select * from certificates where nic = ?',[nic],(err,row)=>{
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
    getCerificatesByNIC
}