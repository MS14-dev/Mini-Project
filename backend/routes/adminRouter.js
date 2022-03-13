const express = require('express')
const {SHA256} = require('crypto-js')

const {getAllStudents} = require('../dbRoutes/students')
const {findAllInstitutions} = require('../dbRoutes/institutions')
const {findAllCourses,findAllCoursesByInstitutionId} = require('../dbRoutes/courses')
const {findConductByStudentId,studentCountsForCourses,studentCountForInstituions,getAllCompletedConducts,getAllConducts,getConductsForParticularCourse} = require('../dbRoutes/conducts')

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
//to get completed conducts
adminRouter.get('/get-completed-conducts',async (req,res)=>{
    let completeConducts = await getAllCompletedConducts();
    if(completeConducts.length != 0){
        res.send({response:true,message:'Successs',data:completeConducts.length})
    }else{
        res.send({response:false,message:'Failed'})
    }
})
//get all conducts
adminRouter.get('/get-all-conduct',async (req,res)=>{
    let conducts = await getAllConducts();
    if(conducts.length != 0){
        res.send({response:true,message:"Success",data:conducts.length})
    }else{
        res.send({response:false,message:"False"})
    }
})

//get all courses of a particular institution
adminRouter.get('/get-courses-by-institution/:id',async (req,res)=>{
    let instId = req.params.id;
    let data = await findAllCoursesByInstitutionId(instId);
    if(data.length){
        res.send({response:true,message:"Success",data:data})
    }else{
        res.send({response:false,message:"No courses yet"})
    }
})
//get conducts for particular course
adminRouter.get('/conducts-by-course/:id',async (req,res)=>{
    let courseId = req.params.id;
    let data = await getConductsForParticularCourse(courseId);
    if(data.length != 0){
        res.send({response:true,message:"Successful",data:data})
    }else{
        res.send({response:true,message:"No conducts yet",data:data})
    }
})

//get all conducts for a particular student
adminRouter.get('/conducts-by-studentId/:id',async (req,res)=>{
    let conducts = await findConductByStudentId(req.params.id);
    if(conducts.length != 0){
        res.send({response:true,message:"Success",data:conducts})
    }else{
        res.send({response:false,message:"No Conducts Yet"})
    }
})

// 24-Bit 48.0 kHz] - [Hi-Res] - Hridayam [Side A+B] (Malayalam) 
module.exports = adminRouter