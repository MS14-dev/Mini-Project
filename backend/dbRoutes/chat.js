const database = require('../database');


const getMessages=(course,sender,receiver)=>{
    return new Promise((resolve,reject)=>{
        database.query(`select course,sender,receiver,message from chat where course = ? AND (sender = ? OR receiver = ?)`,[course,sender,sender],(err,row)=>{
            if(err){
                reject(err)
            }
            else{
                console.log('All Message Row in Chat',row)
                resolve(row)
            }
        })
    })
}


const addMessage=async(course,sender,receiver,message)=>{
    return new Promise((resolve,reject)=>{
        database.query(`insert into chat (course,sender,receiver,message) values(?,?,?,?)`,[course,sender,receiver,message],async(err,row)=>{
            if(err){
                reject(err)
            }
            else{
                let allMessages = await getMessages(course,sender,receiver)
                console.log("All Messages:-->",allMessages)
                if(allMessages.length != 0){
                  resolve(allMessages)
                }else{
                    resolve(allMessages)
                }
            }
        })
    })
  }

module.exports = {
    addMessage,
    getMessages,
}