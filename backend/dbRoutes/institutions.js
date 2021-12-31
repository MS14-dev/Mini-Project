const database = require('../database');

// login purposes
const findInstitutionByUserName=(hashedUserName)=>{
    return new Promise((resolve,reject)=>{
        database.query(`select * from institutions where userName = '${hashedUserName}'`,(err,row)=>{
            if(err){
                reject(err)
            }else{
                resolve(row);
            }
        })
    })
}

const addNewInstitution =(id,name,userName,password)=>{
    return new Promise((resolve,reject)=>{
        database.query(`insert into institutions (id,name,userName,password) values('${id}','${name}',
        '${userName}','${password}')`,(err,row)=>{
            if(err){
                reject(err)
            }else{
                let data = findInstitutionByUserName(userName);
                resolve(data)
            }
        })
    })
}


const findInstitutionById=(id)=>{
    return new Promise((resolve,reject)=>{
        database.query(`select * from institutions where id='${id}'`,(err,row)=>{
            if(err){
                reject(err)
            }else{
                resolve(row)
            }
        })
    })
}

module.exports = {
    addNewInstitution,
    findInstitutionByUserName,
    findInstitutionById
}