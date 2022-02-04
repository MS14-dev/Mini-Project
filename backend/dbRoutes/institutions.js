const res = require('express/lib/response');
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

const addNewInstitution =(id,name,userName,password,image,description)=>{
    return new Promise((resolve,reject)=>{
        database.query(`insert into institutions (id,name,userName,password,image,description) values(?,?,?,?,?,?)`,
        [id,name,userName,password,image,description],(err,row)=>{
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

const findValidityOfUserName=(userName)=>{
    return new Promise((resolve,reject)=>{
        database.query(`select * from institutions where userName='${userName}'`,(err,row)=>{
            if(err){
                reject(err)
            }else{
                resolve(row)
            }
        })
    })
}
const findValidityOfName=(name)=>{
    return new Promise((resolve,reject)=>{
        database.query(`select * from institutions where name='${name}'`,(err,row)=>{
            if(err){
                reject(err)
            }else{
                resolve(row)
            }
        })
    })
}

const findAllInstitutions =()=>{
    return new Promise((resolve,reject)=>{
        database.query(`select name,image,id from institutions`,(err,row)=>{
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
    findInstitutionById,
    findValidityOfUserName,
    findValidityOfName,
    findAllInstitutions
}