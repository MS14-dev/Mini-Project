const database = require('../database');

const getAllBlockFromTable=()=>{
    return new Promise((resolve,reject)=>{

        database.query('select*from blockchain',(err,row)=>{
            if(err){
                reject(err)
            }else{
                // console.log(row)
                let newRow = row.map((data)=>{
                    return JSON.parse(data.Block)
                })
                resolve(newRow)
            }
        })
    })
}

module.exports = {
    getAllBlockFromTable,
}