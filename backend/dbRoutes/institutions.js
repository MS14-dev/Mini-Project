const database = require('../database');

const addNewInstitution =(id,name,userName,password)=>{
    return new Promise((resolve,reject)=>{
        database.query(`insert into institutions (id,name,userName,password) values('${id}','${name}',
        '${userName}','${password}')`,(err,row)=>{
            if(err){
                reject(err)
            }else{
                let data = findUserByUserName(userName);
                resolve(data)
            }
        })
    })
}

// login purposes
const findInstitutionByUserName=(hashedUserName)=>{
    return new Promise((resolve,reject)=>{
        database.query(`select * from institutions where userName = '${hashedUserName}'`,(err,row)=>{
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
}