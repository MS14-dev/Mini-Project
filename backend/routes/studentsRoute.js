const express = require('express')
const {v4:uuid,validate} = require('uuid')
const {SHA256} = require('crypto-js')

const {addNewStudent,getStudentByEmail} = require('../dbRoutes/students')
const {addNewConduct,findConductByStudentId} = require('../dbRoutes/conducts')

const Block = require('../Block')
const BlockChain = require('../BlockChain')


const studentRoute = express.Router();

//signin of students
studentRoute.post('/signin',async(req,res)=>{
    let{name,nic,email,password} = req.body
    let randomStudentId = uuid();

    let hashedEmail = SHA256(email).toString();console.log(hashedEmail);
    let hashedPassword = SHA256(password).toString();
    let hashedNIC = SHA256(nic).toString();
    
    let row = await addNewStudent(name,hashedNIC,hashedEmail,hashedPassword,randomStudentId);
    console.log(row[0].name)
    res.send({randomStudentId})
})

//login of students
studentRoute.post('/login',async(req,res)=>{
    let {email,password} = req.body;

    let hashedEmail = SHA256(email).toString(); console.log(hashedEmail);
    let hashedPassword = SHA256(password).toString();

    let data = await getStudentByEmail(hashedEmail);
    if(data.length == 0){
        res.send("Invalid Email")
    }else{
        if(data[0].password == hashedPassword){
            res.send(data[0])
        }else{
            res.send("Invalid Password")
        }
    }

})

studentRoute.post('/involve-new-course',async(req,res)=>{
    let {student,course} = req.body
    let randomConductId = uuid();

    let data = await addNewConduct(randomConductId,student,course);
    if(data.length != 0){
        res.send({response:true,message:'successfully involve',data})
    }else{
        res.send({response:false,message:'Failed to involve with the course'})
    }
    
})

//just for test conducts and result linkage

studentRoute.get('/exam',(req,res)=>{
    sqlDB.query('select * from exams',(err,row)=>{
        if(err){
            res.send('Query Failed')
        }else{
            res.send(row)
        }
    })
})

//the blockchain part
const blockChain = new BlockChain();
studentRoute.get('/block',(req,res)=>{
    let certificateData = uuid()
    let d = new Date();
    date = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`

    let block = new Block(blockChain.getLatestBlock().index + 1,date,`certificate_${certificateData}`);
    blockChain.addBlock(block)
    res.send(blockChain.isChainValid());
})

module.exports = studentRoute;

// https://docs.microsoft.com/en-us/learn/browse/?terms=blockchain