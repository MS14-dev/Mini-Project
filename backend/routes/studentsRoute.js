const express = require('express')
const {v4:uuid,validate} = require('uuid')
const {SHA256} = require('crypto-js')

const {addNewStudent,getStudentByEmail} = require('../dbRoutes/students')
const {addNewConduct,findConductByStudentId} = require('../dbRoutes/conducts')
const {findResultByConductId} = require('../dbRoutes/results')

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

//involve a particular student to a particular course
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

//get all the conducts details of particular student;
studentRoute.get('/conducts',async(req,res)=>{
    //student id should be get from the session variable;
    let studentId = '0f514580-3742-46ff-9085-b1a885044515';
    let data = await findConductByStudentId(studentId);
    res.send(data);
})

//get exam results of particular conduct(by a student);
studentRoute.post('/conduct/result',async(req,res)=>{
    let {conductId} = req.body
    let data = await findResultByConductId(conductId);
    res.send(data)
})

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