const express = require('express');
const {v4:uuid} = require('uuid')
const {SHA256} = require('crypto-js')
const fileUpload = require('express-fileupload')

const {addNewInstitution,findInstitutionByUserName} = require('../dbRoutes/institutions');
const {addNewCourse} = require('../dbRoutes/courses')

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

institutionRouter.post('/add-new-course',async(req,res)=>{
    let {name,description} = req.body
    let image = req.files.image;

    let randomCourseId = uuid();

    //this will be catch via session, in here a demostration only
    let innstitutionId = "68a5c3e2-f225-45f1-947a-00ed5ce6d9ad";

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