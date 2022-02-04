const express = require('express')

const {findCourseById,findAllCourses,findCourseByUserInput,findAllCoursesByInstitutionId} = require('../dbRoutes/courses')
const {findInstitutionById,findAllInstitutions} = require('../dbRoutes/institutions')
const {findExamsByCourseId} = require('../dbRoutes/exams');
const { response } = require('express');

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


module.exports = generalRouter;