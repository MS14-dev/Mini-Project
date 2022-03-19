const database = require('../database');

const addNewCourse=(id,name,institution,description,image)=>{
    return new Promise((resolve,reject)=>{
        database.query(`insert into courses (id,name,institution,description,image) values
        ('${id}',?,'${institution}',?,'${image}')`,[name,description],(err,row)=>{
            if(err){
                reject(err)
            }else{
                resolve(row); 
            }
        })
    })
}

const findCourseById=(id)=>{
    return new Promise((reseolve,reject)=>{

        database.query(`select courses.name,courses.image,courses.description,institutions.id AS institutionId, 
        institutions.name as institution, courses.id, institutions.image AS institutionImg
        from courses,institutions 
        where courses.institution = institutions.id 
        AND courses.id='${id}'`,(err,row)=>{
            if(err){
                reject(err)
            }else{
                reseolve(row)
            }
        })
    })
}

const findAllCourses=()=>{
    return new Promise((resolve,reject)=>{
        database.query(`select*from courses limit 4`,(err,row)=>{
            if(err){
                reject(err)
            }else{
                resolve(row)
            }
        })
    })
}

//find course by user input
const findCourseByUserInput=(userInput)=>{
    return new Promise((resolve,reject)=>{
        database.query(`select*from courses where name like '%${userInput}%'`,(err,row)=>{
            if(err){
                reject(err)
            }else{
                resolve(row)
            }
        })
    })
}

const findCourseByIdForCertificate=(id)=>{
    return new Promise((resolve,reject)=>{
        database.query(`select*from courses where id='${id}'`,(err,row)=>{
            if(err){
                reject(err)
            }else{
                resolve(row)
            }
        })
    })
}

const findAllCoursesByInstitutionId=(institutionId)=>{
    return new Promise((resolve,reject)=>{
        database.query(`select*from courses where institution='${institutionId}'`,(err,row)=>{
            if(err){
                reject(err)
            }else{
                resolve(row)
            }
        })
    })
}

module.exports = {
    addNewCourse,
    findCourseById,
    findCourseById,
    findAllCourses,
    findCourseByUserInput,
    findCourseByIdForCertificate,
    findAllCoursesByInstitutionId
};