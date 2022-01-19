const database = require('../database');

const findResultByConductId=async(conductId)=>{
    return new Promise((resolve,reject)=>{
        database.query(`select * from results where conduct = '${conductId}'`,(err,row)=>{
            if(err){
                reject(err)
            }else{
                resolve(row)
            }
        })
    })
}

const addNewResult =(resultId,conductId)=>{
    return new Promise((resolve,reject)=>{
        database.query(`insert into results (id,conduct) values('${resultId}','${conductId}')`,(err,row)=>{
            if(err){
                reject(err)
            }else{
                resolve(row)
            }
        })
    })
}

module.exports = {
    findResultByConductId,
    addNewResult,
}