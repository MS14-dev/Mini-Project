const database = require('../database')

const addNewConduct = async(id,student,course)=>{

    return new Promise((resolve,reject)=>{
        database.query(`insert into conducts (id,student,course) values
        ('${id}','${student}','${course}')`,(err,row)=>{
            if(err){
                reject(err)
            }else{
                let data = findConductById(id)
                resolve(data)
            }
        })
    })
}

const findConductById=async(id)=>{
    return new Promise((resolve,reject)=>{
        database.query(`select * from conducts where id='${id}'`,(err,row)=>{
            if(err){
                reject(err)
            }else{
                resolve(row)
            }
        })
    })
}

const findConductByStudentId = async(id)=>{
    return new Promise((resolve,reject)=>{
        // database.query(`select * from conducts where student = '${id}'`,
        // (err,row)=>{
        //     if(err){
        //         reject(err)
        //     }else{
        //         resolve(row)
        //     }
        // })
        database.query(`SELECT courses.name,conducts.id as conductId
                      FROM conducts,courses  where conducts.student = '${id}'`,
        (err,row)=>{
            if(err){
                reject(err)
            }else{
                resolve(row)
            }
        })
    })
}

//find a particular student already involved with course
const findInvolvementOfStudentToCourse=(student,course)=>{
     
    return new Promise((resolve,reject)=>{
        database.query(`select*from conducts where student='${student}' AND course='${course}'`,(err,row)=>{
            if(err){
                reject(err)
            }else{
                resolve(row)
            }
        })
    })
}

module.exports = {
    addNewConduct,
    findConductById,
    findConductByStudentId,
    findInvolvementOfStudentToCourse
}