const express = require('express')
const {SHA256} = require('crypto-js')

const {findAdmin} = require('../dbRoutes/admin')
const {getAllStudents} = require('../dbRoutes/students')
const {findAllInstitutions} = require('../dbRoutes/institutions')
const {findAllCourses,findAllCoursesByInstitutionId} = require('../dbRoutes/courses')
const {findConductByStudentId,studentCountsForCourses,studentCountForInstituions,getAllCompletedConducts,getAllConducts,getConductsForParticularCourse} = require('../dbRoutes/conducts')

const adminRouter = express.Router()

// login purposes only
adminRouter.post('/login',async(req,res)=>{
    let {username,password} = req.body
    
    let admin = await findAdmin(username);
    if(admin.length != 0){
        if(admin[0].password == password){
            req.session.isLogged = true;
            req.session.adminId = admin[0].id
            res.send({response:true,message:"Successfully Logged",data:admin})
        }else{
            res.send({response:false,message:"The password you entered is invalid",data:null})
        }
    }else{
        res.send({response:false,message:"Invalid username",data:null})
    }
    // res.send({response:true,message:"Successfully Logged",data:null})
    // let hashedUserName = SHA256(userName).toString();
    // let hashedPassword = SHA256(password).toString();
})

adminRouter.get('/all-students',async(req,res)=>{

if(req.session.isLogged && req.session.adminId){
    const students = await getAllStudents();
    if(students.length != 0){
        res.send({response:true,message:"Success",data:students})
    }else{
        res.send({response:true,message:"No Students currently",data:students})
    }
}else{
    res.send({response:false,message:'Need to login First'})
}
})

adminRouter.get('/all-institutions',async(req,res)=>{

if(req.session.isLogged && req.session.adminId){
    const institutions = await findAllInstitutions();
    if(institutions.length != 0){
        res.send({response:true,message:"Success",data:institutions})
    }else{
        res.send({response:true,message:"No Students currently",data:institutions})
    }
}else{
    res.send({response:false,message:'Need to login First'})
}
})

adminRouter.get('/all-courses',async(req,res)=>{

if(req.session.isLogged && req.session.adminId){
    const courses = await findAllCourses();
    if(courses.length != 0){
        res.send({response:true,message:"Success",data:courses})
    }else{
        res.send({response:true,message:"No Students currently",data:courses})
    }
}else{
    res.send({response:false,message:'Need to login First'})
}
})

adminRouter.get('/student-count-by-course',async (req,res)=>{

if(req.session.isLogged && req.session.adminId){
    let studentCounts = await studentCountsForCourses();
    if(studentCounts.length != 0){
        console.log(studentCounts)
        res.send({response:true,message:'Success',data:studentCounts})
    }else{
        res.send({response:false,message:"No students yet"})
    }
}else{
    res.send({response:false,message:'Need to login First'})
}
})

adminRouter.get('/student-count-by-institution',async (req,res)=>{

if(req.session.isLogged && req.session.adminId){
    let studentCounts = await studentCountForInstituions();
    if(studentCounts.length != 0){
        console.log(studentCounts)
        res.send({response:true,message:'Success',data:studentCounts})
    }else{
        res.send({response:false,message:"No students yet"})
    }
}else{
    res.send({response:false,message:'Need to login First'})
}
})

//to get completed conducts
adminRouter.get('/get-completed-conducts',async (req,res)=>{

if(req.session.isLogged && req.session.adminId){
    let completeConducts = await getAllCompletedConducts();
    if(completeConducts.length != 0){
        res.send({response:true,message:'Successs',data:completeConducts.length})
    }else{
        res.send({response:false,message:'Failed'})
    }
}else{
    res.send({response:false,message:'Need to login First'})
}
})

//get all conducts
adminRouter.get('/get-all-conduct',async (req,res)=>{

if(req.session.isLogged && req.session.adminId){    
    let conducts = await getAllConducts();
    if(conducts.length != 0){
        res.send({response:true,message:"Success",data:conducts.length})
    }else{
        res.send({response:false,message:"False"})
    }
}else{
    res.send({response:false,message:'Need to login First'})
}
})

//get all courses of a particular institution
adminRouter.get('/get-courses-by-institution/:id',async (req,res)=>{

if(req.session.isLogged && req.session.adminId){   
    let instId = req.params.id;
    let data = await findAllCoursesByInstitutionId(instId);
    if(data.length){
        res.send({response:true,message:"Success",data:data})
    }else{
        res.send({response:false,message:"No courses yet"})
    }
}else{
    res.send({response:false,message:'Need to login First'})
}
})

//get conducts for particular course
adminRouter.get('/conducts-by-course/:id',async (req,res)=>{

if(req.session.isLogged && req.session.adminId){  
    let courseId = req.params.id;
    let data = await getConductsForParticularCourse(courseId);
    if(data.length != 0){
        res.send({response:true,message:"Successful",data:data})
    }else{
        res.send({response:true,message:"No conducts yet",data:data})
    }
}else{
    res.send({response:false,message:'Need to login First'})
}
})

//get all conducts for a particular student
adminRouter.get('/conducts-by-studentId/:id',async (req,res)=>{

if(req.session.isLogged && req.session.adminId){  
    let conducts = await findConductByStudentId(req.params.id);
    if(conducts.length != 0){
        res.send({response:true,message:"Success",data:conducts})
    }else{
        res.send({response:false,message:"No Conducts Yet"})
    }
}else{
    res.send({response:false,message:'Need to login First'})
}
})

adminRouter.get('/logout',async (req,res)=>{
    if(req.session.isLogged && req.session.adminId){ 
        req.session.destroy();
        res.send({response:true,message:'Successfully Logout'})
    }else{
        res.send({response:false,message:'Need to login First'})
    }
})

// 24-Bit 48.0 kHz] - [Hi-Res] - Hridayam [Side A+B] (Malayalam) 
module.exports = adminRouter
// DiffHell