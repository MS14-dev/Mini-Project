const express = require('express')
const {findCourseById} = require('../dbRoutes/courses')
const {findInstitutionById} = require('../dbRoutes/institutions')

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



module.exports = generalRouter;