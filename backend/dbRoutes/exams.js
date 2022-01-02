const database = require('../database');

const getExamsByCourseId=async(courseId)=>{

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
    getExamsByCourseId,
}