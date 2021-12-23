const database = require('../database');

const addNewStudent=(name,nic,email,password,id)=>{
    return new Promise((resolve,reject)=>{
        database.query(`insert into students (id,name,nic,email,password) 
        values('${id}','${name}','${nic}','${email}','${password}')`,(err,row)=>{
            if(err){
                reject(err)
            }else{
                let rowLogged = getStudentByEmail(email)
                resolve(rowLogged)
            }
        })
    })
}

//login purposes
const getStudentByEmail=(email)=>{
    return new Promise((resolve,reject)=>{
        database.query(`select * from students where email='${email}'`,(err,row)=>{
            if(err){
                reject(err)
            }else{
                resolve(row)
            }
        })
    })
}

module.exports = {
    addNewStudent,
    getStudentByEmail
}