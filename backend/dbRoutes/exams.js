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

const addNewExam =(id,course,t1,t2,exam1,exam2)=>{
    return new Promise((resolve,reject)=>{
        
        // let {wrong11,wrong12,wrong13,correct1} = ans1
        // let {wrong21,wrong22,wrong23,correct2} = ans2
        exam1Json = JSON.stringify(exam1)
        exam2Json = JSON.stringify(exam2)

        database.query(`insert into exams (id,course,theory1,theory2,exam1,exam2) 
        values('${id}','${course}','${t1}','${t2}', ?,?)`,[exam1Json,exam2Json],(err,row)=>{
            if(err){
                reject(err)
            }else{
                resolve(row)
            }
        })

    })
}

const updateResultByConductId=async(conductId,examNumb)=>{
    return new Promise((resolve,reject)=>{
        database.query(`UPDATE results SET exam${examNumb} = 10 WHERE conduct = '${conductId}'`,(err,row)=>{
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
    updateResultByConductId,
    addNewExam
}

// `insert into exams (id,course,theory1,theory2,exam1,exam2) 
//         values('${id}','${course}','${t1}','${t2}', 
//         '{'question':'${q1}',
//         'answers':'['{'answer':'${wrong11}','correct':'false'}','{'answer':'${wrong12}','correct':'false'}','{'answer':'${wrong13}','correct':'false'}','{'answer':'${correct1}','correct':'true'}']'}'
//         ,
//         '{'question':'${q2}',
//         'answers':'['{'answer':'${wrong21}','correct':'false'}','{'answer':'${wrong22}','correct':'false'}','{'answer':'${wrong23}','correct':'false'}','{'answer':'${correct2}','correct':'true'}']'}'
//         )`