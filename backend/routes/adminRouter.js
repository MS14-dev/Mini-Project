const express = require('express')
const {SHA256} = require('crypto-js')

const {getAllStudents} = require('../dbRoutes/students')
const {findAllInstitutions} = require('../dbRoutes/institutions')
const {findAllCourses} = require('../dbRoutes/courses')
const {studentCountsForCourses,studentCountForInstituions,getAllCompletedConducts} = require('../dbRoutes/conducts')

const adminRouter = express.Router()

// login purposes only
adminRouter.post('/login',async(req,res)=>{
    let {userName,password} = req.body
    let hashedUserName = SHA256(userName).toString();
    let hashedPassword = SHA256(password).toString();
})

adminRouter.get('/all-students',async(req,res)=>{
    const students = await getAllStudents();
    if(students.length != 0){
        res.send({response:true,message:"Success",data:students})
    }else{
        res.send({response:true,message:"No Students currently",data:students})
    }
})
adminRouter.get('/all-institutions',async(req,res)=>{
    const institutions = await findAllInstitutions();
    if(institutions.length != 0){
        res.send({response:true,message:"Success",data:institutions})
    }else{
        res.send({response:true,message:"No Students currently",data:institutions})
    }
})
adminRouter.get('/all-courses',async(req,res)=>{
    const courses = await findAllCourses();
    if(courses.length != 0){
        res.send({response:true,message:"Success",data:courses})
    }else{
        res.send({response:true,message:"No Students currently",data:courses})
    }
})
adminRouter.get('/student-count-by-course',async (req,res)=>{
    let studentCounts = await studentCountsForCourses();
    if(studentCounts.length != 0){
        console.log(studentCounts)
        res.send({response:true,message:'Success',data:studentCounts})
    }else{
        res.send({response:false,message:"No students yet"})
    }
})
adminRouter.get('/student-count-by-institution',async (req,res)=>{
    let studentCounts = await studentCountForInstituions();
    if(studentCounts.length != 0){
        console.log(studentCounts)
        res.send({response:true,message:'Success',data:studentCounts})
    }else{
        res.send({response:false,message:"No students yet"})
    }
})
adminRouter.get('/get-completed-conducts',async (req,res)=>{
    let completeConducts = await getAllCompletedConducts();
    if(completeConducts.length != 0){
        res.send({response:true,message:'Successs',data:completeConducts.length})
    }else{
        res.send({response:false,message:'Failed'})
    }
})

module.exports = adminRouter