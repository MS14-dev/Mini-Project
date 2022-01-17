const database = require('../database');

const addNewCourse=(id,name,institution,description,image)=>{
    return new Promise((resolve,reject)=>{
        database.query(`insert into courses (id,name,institution,description,image) values
        ('${id}','${name}','${institution}','${description}','${image}')`,(err,row)=>{
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

        database.query(`select * from courses where id='${id}'`,(err,row)=>{
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
        database.query(`select*from courses`,(err,row)=>{
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
    findAllCourses};