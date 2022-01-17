const database = require('../database');

const findExamsByCourseId=async(courseId)=>{

    return new Promise((resolve,reject)=>{
        database.query(`select * from exams where course='${courseId}'`,(err,row)=>{
            if(err){
                reject(err)
            }else{
                resolve(row)
            }
        })
    })

}

module.exports = {
    findExamsByCourseId,
}