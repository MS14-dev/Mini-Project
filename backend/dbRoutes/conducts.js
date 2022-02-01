const database = require('../database')

const addNewConduct = async(id,student,course)=>{

    return new Promise((resolve,reject)=>{
        database.query(`insert into conducts (id,student,course) values
        ('${id}','${student}','${course}')`,async(err,row)=>{
            if(err){
                reject(err)
            }else{
                let data = await findConductById(id)
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
        database.query(`SELECT courses.name,conducts.id as conductId,courses.image as image, conducts.certificateId
                      FROM conducts inner join courses on conducts.course = courses.id where conducts.student = '${id}'`,
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

// find all the conducts in particular institution;
const findAllConductsByInstitution=(institutionId)=>{
    return new Promise((resolve,reject)=>{
        database.query(`SELECT conducts.id,conducts.certificateId,conducts.complete from conducts join courses on courses.id = conducts.course 
        join institutions on institutions.id = courses.institution where institutions.id ='${institutionId}'`,(err,row)=>{
            if(err){
                reject(err)
            }else{
                resolve(row)
            }
        })
    })
}

const updateCompleteOfConduct=(conductId)=>{

    return new Promise((resolve,reject)=>{
        database.query(`update conducts set complete = 1 where id='${conductId}'`,(err,row)=>{
            if(err){
                reject(err)
            }else{
                resolve(row)
            }
        })
    })
}

const updateCertificateId=(conductId,certificateId)=>{
    return new Promise((resolve,reject)=>{
        database.query(`update conducts set certificateId = '${certificateId}' where id = '${conductId}'`,(err,row)=>{
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
    findInvolvementOfStudentToCourse,
    findAllConductsByInstitution,
    updateCompleteOfConduct,
    updateCertificateId
}