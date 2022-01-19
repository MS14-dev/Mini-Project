const express = require('express')
const {v4:uuid,validate} = require('uuid')
const {SHA256} = require('crypto-js')

const {addNewStudent,getStudentByEmail,getStudentByStudentId} = require('../dbRoutes/students')
const {addNewConduct,findConductByStudentId,findConductById,findInvolvementOfStudentToCourse} = require('../dbRoutes/conducts')
const {findResultByConductId,addNewResult} = require('../dbRoutes/results')
const {findExamsByCourseId,updateResultByConductId} = require('../dbRoutes/exams')

const Block = require('../Block')
const BlockChain = require('../BlockChain')
const { findCourseById } = require('../dbRoutes/courses')


const studentRoute = express.Router();

//signin of students
studentRoute.post('/signin',async(req,res)=>{

    if(!req.session.isLogged){
    let{name,nic,email,password} = req.body
    let randomStudentId = uuid();
    console.log(req.body)
    let hashedEmail = SHA256(email).toString();console.log(hashedEmail);
    let hashedPassword = SHA256(password).toString();
    let hashedNIC = SHA256(nic).toString();
    
    let row = await addNewStudent(name,hashedNIC,hashedEmail,hashedPassword,randomStudentId);
    // console.log(row[0].name)
    req.session.isLogged = true;
    req.session.studentId = row[0].id
    res.send({response:true,message:'Successfully Signin',data:row[0]})
    }else{
        res.send({response:false,message:'Already Logged',data:null})
    }
})

//login of students
studentRoute.post('/login',async(req,res)=>{
    if(!req.session.isLogged){
    let {email,password} = req.body;
    console.log(req.body)
 
    let hashedEmail = SHA256(email).toString(); console.log(hashedEmail);
    let hashedPassword = SHA256(password).toString();

    let data = await getStudentByEmail(hashedEmail);
    if(data.length == 0){
        res.send({response:false,message:"Invalid Email",data:null})
    }else{
        if(data[0].password == hashedPassword){
            req.session.isLogged = true;
            req.session.studentId = data[0].id
            res.send({response:true,message:'success',data:data[0]})
        }else{
            res.send({response:false,message:"Invalid Password",data:null})
        }
    }}
    else{
        console.log(req.session)
        res.send({response:false,message:'Already Logged',data:null})
    }

})

studentRoute.get('/logout',(req,res)=>{
    console.log(req.session)
    if(req.session.isLogged){
        // req.session.isLog = false;
        // req.session.studentId = '';
        req.session.destroy();
        res.send({response:true,message:'Successfully Logged out',data:null})
    }else{
        res.send({response:false,message:'Need to login first',data:null})
    }
})

//get particular student details by his/her student id.(For after login purposes) 
//original
// studentRoute.get('/by-id/:id',async(req,res)=>{
studentRoute.get('/by-id',async(req,res)=>{
    if(req.session.isLogged){
        //original
        // let id = req.params.id
        let id = req.session.studentId
        let data = await getStudentByStudentId(id)
        if(data.length != 0){
            console.log(data)
            res.send({response:true,message:'success',data:data[0]})
        }else{
            res.send({response:false,message:'Logged but unsuccessfull',data:null})
        }
    }else{
        res.send({response:false,message:'Need to login first',data:null})
    }
})

//involve a particular student to a particular course
studentRoute.post('/involve-new-course',async(req,res)=>{
    
    let {course} = req.body
    let student = req.session.studentId;

    if(req.session.isLogged){

        let involveData = await findInvolvementOfStudentToCourse(student,course)
      if(involveData.length == 0){
        let randomConductId = uuid();

        let data = await addNewConduct(randomConductId,student,course);
        if(data.length != 0){
            //original
            // res.send({response:true,message:'successfully involve',data})
            let randomResultId = uuid();
            let resultResponse = await addNewResult(randomResultId,randomConductId);
            if(resultResponse){
                 res.send({response:true,message:'successfully involve',data})
            }
        }else{
            res.send({response:false,message:'Failed to involve with the course'})
        }
      }else{
          res.send({response:false,message:'You have already involved',data:null})
      }
    }
    else{
        res.send({response:false,message:'Need to login first'})
    }
    
})

//get all the conducts details of particular student;
studentRoute.get('/conducts',async(req,res)=>{
    if(req.session.isLogged){
        let id = req.session.studentId
        let data = await findConductByStudentId(id);
        res.send({response:true,message:'All involved courses',data:data})
    }else{
        res.send({response:false,message:'Need to login first',data:null})
    }
})

//get particluar conduct details of a student by it's ID
studentRoute.get('/conduct/:conductId',async (req,res)=>{
    if(req.session.isLogged){
        let data = await findConductById(req.params.conductId)
        res.send({response:true,message:'Success',data:data[0]});
    }else{
        res.send({response:false,message:'Need to login first',data:null})
    }
})

//get exam results of particular conduct(by a student);
studentRoute.get('/conduct/result/:conductId',async(req,res)=>{
    let conductId = req.params.conductId;
    console.log('conduct/result called')
    let data = await findResultByConductId(conductId);
    if(data.length != 0){
        res.send({response:true,message:'Successfull',data:data[0]})
    }else{
        res.send({response:false,message:"Error",data:null})
    }
})

//get exams for particular conduct by student (by conduct ID)(remaining exams and theories)
//theory one and exam one
studentRoute.get(`/exam-by-conduct/:conductId`,async(req,res)=>{

    if(req.session.isLogged){
    let conductId = req.params.conductId;
    let conductDetails = await findConductById(conductId);

    if(conductDetails.length > 0){
        let courseId = conductDetails[0].course;
        let examDetails = await findExamsByCourseId(courseId);
        res.send({response:true,message:'success',data:examDetails[0]})
    }else{
        res.send({response:false,message:'error',data:null});
    }
    }else{
        res.send({response:false,message:'Need to login first',data:null})
    }

})

//update exam 1 results when particular student achieve it.
studentRoute.post('/result-update-exam1',async(req,res)=>{
    let {conductId,exam} = req.body
    if(req.session.isLogged){
        let data = await updateResultByConductId(conductId,exam)
        console.log(data)
        res.send('K');
    }else{
        res.send({response:false,message:'Need to login first',data:null})
    }
})
studentRoute.post('/result-update-exam2',async(req,res)=>{
    let {conductId,exam} = req.body
    if(req.session.isLogged){
        let data = await updateResultByConductId(conductId,exam)
        console.log(data)
        res.send('K');
    }else{
        res.send({response:false,message:'Need to login first',data:null})
    }
})
// studentRoute.get('/exam',(req,res)=>{
//     sqlDB.query('select * from exams',(err,row)=>{
//         if(err){
//             res.send('Query Failed')
//         }else{
//             res.send(row)
//         }
//     })
// })

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