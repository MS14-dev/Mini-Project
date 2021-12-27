const express = require('express');
const {v4:uuid} = require('uuid')
const {SHA256} = require('crypto-js')
const fileUpload = require('express-fileupload')

const {addNewInstitution,findInstitutionByUserName} = require('../dbRoutes/institutions');
const {addNewCourse} = require('../dbRoutes/courses')

const institutionRouter = express.Router();
institutionRouter.use(fileUpload());

institutionRouter.post('/signin',async(req,res)=>{
    let {name,userName,password} = req.body;
    let randomInsId = uuid();

    let hashedUserName = SHA256(userName).toString();
    let hashedPassword = SHA256(password).toString();

    let data = await addNewInstitution(randomInsId,name,hashedUserName,hashedPassword);
    res.send(data);
})

institutionRouter.post('/login',async(req,res)=>{
    let {userName,password} = req.body
    let hashedUserName = SHA256(userName).toString()
    let hashedPassword = SHA256(password).toString();
    console.log(req.session)
    let rows = await findInstitutionByUserName(hashedUserName);
    if(rows.length == 0){
        res.send({response:false,message:'Invalid user name'})
    }else{
        if(rows[0].password != hashedPassword ){
            res.send({response:false,message:'Invalid Password'})
        }else{
            req.session.logged = true;
            res.send({response:true,message:rows[0]})
        }
    }
})

institutionRouter.post('/add-new-course',async(req,res)=>{
    let {name,description} = req.body
    let image = req.files.image;

    let randomCourseId = uuid();

    //this will be catch via session, in here a demostration only
    let innstitutionId = "b39d1361-353e-4613-9c17-44d4425603dd";

    let newFilePath = __dirname+'/../public/images/courses/';
    let newFileName = `${randomCourseId}` + image.name;

    image.mv(`${newFilePath}${newFileName}`,async(err)=>{
        if(err){
            console.log('Sorry')
            res.send({response:false,message:'Failed to add new course'})
        }else{
            let imagePath = `http://localhost:8000/public/images/courses/${newFileName}`
            let data  = await addNewCourse(randomCourseId,name,innstitutionId,description,imagePath);
            console.log(data)
            // console.log('Success')
            res.send({response:true,message:'Successfully Added'})
        }
    })

})

module.exports = institutionRouter;