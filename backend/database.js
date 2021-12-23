const mysql = require('mysql');

const SQLdatabase = mysql.createConnection({
    host:'localhost',
    port:3306,
    database:'mini_project',
    user:'root',
    password:''
})

SQLdatabase.connect((err)=>{
    if(err){
        console.log('SQL database connection failed')
    }else{
        console.log('SQL database connection successfull')
    }
})

module.exports = SQLdatabase;