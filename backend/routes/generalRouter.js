const express = require('express')

const {findCourseById,findAllCourses} = require('../dbRoutes/courses')
const {findInstitutionById} = require('../dbRoutes/institutions')
const {findExamsByCourseId} = require('../dbRoutes/exams');
const { response } = require('express');

const generalRouter = express.Router();

//find a specific course by course ID
generalRouter.post('/course',async (req,res)=>{
    let {courseId} = req.body;
    let data = await findCourseById(courseId)
    console.log(courseId)
    if(data.length != 0){
        res.send({response:true,message:'successfull',data})
    }else{
        res.send({response:false,message:'No matching course'})
    }
})

generalRouter.post('/institution', async (req,res)=>{

    let {institutionId} = req.body;
    let data = await findInstitutionById(institutionId);

    if(data.length != 0){
        res.send({response:true,message:'Find the course',data})
    }else{
        res.send({response:false,message:'Cant find the institution',data})
    }

})

//find all the courses
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



module.exports = generalRouter;