const express = require('express')
const crypto = require('crypto')
const {SHA256} = require('crypto-js')
const Assert = require('assert')
const ShortId = require('shortid')

const {findCourseById,findAllCourses,findCourseByUserInput,findAllCoursesByInstitutionId} = require('../dbRoutes/courses')
const {findInstitutionById,findAllInstitutions} = require('../dbRoutes/institutions')
const {findExamsByCourseId} = require('../dbRoutes/exams');
const {addNewCertificate} = require('../dbRoutes/certificates')

const { response } = require('express');
const { isCryptoKey } = require('util/types')

const generalRouter = express.Router();

//find a specific course by course ID
generalRouter.post('/course',async (req,res)=>{
    let {courseId} = req.body;
    let data = await findCourseById(courseId)
    console.log(courseId)
    if(data.length != 0){
        res.send({response:true,message:'successfull',data:data[0]})
    }else{
        res.send({response:false,message:'No matching course',data:null})
    }
})

//find courses by user inputs
generalRouter.post('/courses-by-input',async (req,res)=>{
    let {userInput} = req.body;
    let data = await findCourseByUserInput(userInput)

    if(data.length != 0){
        res.send({response:true,message:'successfull',data:data})
    }else{
        res.send({response:false,message:'No matching courses for your input',data:null})
    }
})

generalRouter.post('/institution', async (req,res)=>{

    let {institutionId} = req.body;
    let data = await findInstitutionById(institutionId);

    if(data.length != 0){
        res.send({response:true,message:'Find the course',data:data[0]})
    }else{
        res.send({response:false,message:'Cant find the institution',data})
    }

})

//find all the courses limi 4
generalRouter.get('/courses',async(req,res)=>{
    let data = await findAllCourses();
    if(data.length == 0){
        res.send({response:false,message:"No courses"})
    }else{
        res.send({response:true,message:'Successful',courses:data})
    }
})

//just for access a particular exam
generalRouter.get('/exam',async(req,res)=>{
    let data = await findExamsByCourseId('37f82b34-8119-4f2b-8b4b-9335a1f13e18')
    res.send(data)
})

//find all institutions
generalRouter.get('/all-institutions',async (req,res)=>{
    console.log("All Courses")
    let data = await findAllInstitutions();
    if(data.length != 0){
        res.send({response:true,message:"Success",data})
    }else{
        res.send({response:false,message:"No Institutions yet",data:null})
    }
})

//find all courses for particular institution
generalRouter.post('/all-courses-by-institution',async (req,res)=>{
    let {institutionId} = req.body
    let data = await findAllCoursesByInstitutionId(institutionId)
    if(data.length != 0){
        res.send({response:true,message:"Successful",data:data})
    }else{
        res.send({response:false,message:"NO Courses yet",data})
    }
})

// the code below is to only test the private and public key generating
generalRouter.post('/test',async(req,res)=>{



// crypto-random-string - npm
// let id = ShortId.generate();
// let valid = ShortId.isValid(id)
// res.send({id,valid})



let prime_length = 60;
let DiffHell = crypto.createDiffieHellman(prime_length);

DiffHell.generateKeys('base64');
let studentKey = DiffHell.getPublicKey('base64');
let institutionKey = DiffHell.getPrivateKey('base64');


let hash = SHA256(`${studentKey}${institutionKey}`).toString()

})


module.exports = generalRouter;


// const alice = Crypto.createDiffieHellman(50);
// const aliceKey = alice.generateKeys();

// // Generate Bob's keys...
// const bob = Crypto.createDiffieHellman(alice.getPrime(), alice.getGenerator());
// const bobKey = bob.generateKeys();

// // Exchange and generate the secret...
// const aliceSecret = alice.computeSecret(bobKey);
// const bobSecret = bob.computeSecret(aliceKey);
// console.log({k:aliceSecret.toString('hex'),f:bobSecret.toString('hex')})
// // OK
// console.log(aliceSecret.toString('hex') == bobSecret.toString('hex'))
// res.send("hey")