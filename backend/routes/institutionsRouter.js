const express = require('express');
const {v4:uuid} = require('uuid')
const {SHA256} = require('crypto-js')
const fileUpload = require('express-fileupload')

const {addNewInstitution,findInstitutionByUserName,findInstitutionById} = require('../dbRoutes/institutions');
const {addNewCourse} = require('../dbRoutes/courses')
const {addNewExam} = require('../dbRoutes/exams');
const { response } = require('express');

const institutionRouter = express.Router();
institutionRouter.use(fileUpload());

institutionRouter.post('/signin',async(req,res)=>{
    if(!req.session.isLogged){
    let {name,userName,password} = req.body;
    let image = req.files.image;
    console.log(image)
    let randomInsId = uuid();

    let newImagePath = __dirname+'/../public/images/institutions/';
    let newImageName = randomInsId+image.name;

    let hashedUserName = SHA256(userName).toString();
    let hashedPassword = SHA256(password).toString();

    image.mv(`${newImagePath}${newImageName}`,async(err)=>{

        if(err){
            res.send({response:false,message:'Failed to register',data:null})
        }else{
            let imagePath = `http://localhost:8000/public/images/institutions/${newImageName}`
            let data = await addNewInstitution(randomInsId,name,hashedUserName,hashedPassword,imagePath);
            req.session.isLogged = true;
            req.session.institutionId = data[0].id;
            res.send({response:true,message:'Successfully Registered',data:data[0]});
        }
    })
    }else{
        res.send({response:false,message:'Already Logged',data:null})
    }
})

institutionRouter.post('/login',async(req,res)=>{

    if(!req.session.isLogged){
        let {userName,password} = req.body
        let hashedUserName = SHA256(userName).toString()
        let hashedPassword = SHA256(password).toString();
        console.log(req.session)
        let rows = await findInstitutionByUserName(hashedUserName);
        if(rows.length == 0){
            res.send({response:false,message:'Invalid user name',data:null})
        }else{
            if(rows[0].password != hashedPassword ){
                res.send({response:false,message:'Invalid Password',data:null})
            }else{
                req.session.isLogged = true;
                req.session.institutionId = rows[0].id
                res.send({response:true,message:'Successfully Logged',data:rows[0]})
            }
        }
    }else{
        res.send({response:false,message:'Already Logged',data:null})
    }
})

institutionRouter.get('/logout',(req,res)=>{
    if(req.session.isLogged){
        req.session.destroy();
        res.send({response:true,message:'Successfully logout',data:null})
    }else{
        res.send({response:false,message:'Need to login first',data:null})
    }
})

//for after login purposes
institutionRouter.get('/by-id',async(req,res)=>{

    if(req.session.isLogged){
    let institutionId = req.session.institutionId;
    let data = await findInstitutionById(institutionId);
        if(data.length != 0){
            res.send({response:true,message:'Successful',data:data[0]})
        }else{
            res.send({response:false,message:'Ooops some server error',data:null})
        }
    }
    else{
        res.send({response:false,message:'Need to login first',data:null})
    }
})

institutionRouter.post('/add-new-course',async(req,res)=>{
    let {name,
        description,
        theory1,
        theory2,
        question1,
        question2,
        wrong11,
        wrong12,
        wrong13,
        wrong21,
        wrong22,
        wrong23,
        correct1,
        correct2} = req.body
    let image = req.files.image;
    
    if(req.session.isLogged){
        let randomCourseId = uuid();

        //this will be catch via session, in here a demostration only
        let innstitutionId = req.session.institutionId;

        let newFilePath = __dirname+'/../public/images/courses/';
        let newFileName = `${randomCourseId}` + image.name;

        image.mv(`${newFilePath}${newFileName}`,async(err)=>{
            if(err){
                console.log('Sorry')
                res.send({response:false,message:'Failed to add new course'})
            }else{
                let imagePath = `http://localhost:8000/public/images/courses/${newFileName}`
                let data  = await addNewCourse(randomCourseId,name,innstitutionId,description,imagePath);
                if(data.affectedRows == 1){
                    
                    let randomExamId = uuid();
                    let exam1 = {question:question1,answers:[{answer:wrong11,correct:'false'},{answer:wrong12,correct:'false'},{answer:wrong13,correct:'false'},{answer:correct1,correct:'true'},]}
                    let exam2 = {question:question2,answers:[{answer:wrong21,correct:'false'},{answer:wrong22,correct:'false'},{answer:wrong23,correct:'false'},{answer:correct2,correct:'true'},]}
                    
                    let afterAddExam = await addNewExam(randomExamId,randomCourseId,theory1,theory2,exam1,exam2)
                    if(afterAddExam.affectedRows == 1){
                        res.send({response:true,message:'Successfuly Added',data:afterAddExam})
                    }
                }
                else{
                res.send({response:false,message:'Oops some server error'})
                }
            }
        })
    }else{
        res.send({response:false,message:'Need login first',data:null})
    }
})

module.exports = institutionRouter;