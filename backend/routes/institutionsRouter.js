const express = require('express');
const {v4:uuid} = require('uuid')
const {SHA256} = require('crypto-js')
const crypto = require('crypto')
const fileUpload = require('express-fileupload')

const {addNewInstitution,findInstitutionByUserName,findInstitutionById,findValidityOfName,findValidityOfUserName} = require('../dbRoutes/institutions');
const {addNewCourse,findCourseById,findCourseByIdForCertificate} = require('../dbRoutes/courses')
const {addNewExam} = require('../dbRoutes/exams');
const { response } = require('express');
const  {findAllConductsByInstitution,findConductById,updateCertificateId} = require('../dbRoutes/conducts')
const {getStudentByStudentId} = require('../dbRoutes/students')
const {addNewCertificate,getCerificatesByNIC} = require('../dbRoutes/certificates')


//Block class
const Block = require('../Block')
//Blockchain Class
const BlockChain = require('../BlockChain')
//block mongodb model
const block = require('../models/Block')

const institutionRouter = express.Router();
institutionRouter.use(fileUpload());

institutionRouter.post('/signin',async(req,res)=>{
    if(!req.session.isLogged){
    let {name,userName,password,description} = req.body;
    let image = req.files.image;
    console.log(image)
    let randomInsId = uuid();

    let newImagePath = __dirname+'/../public/images/institutions/';
    let newImageName = randomInsId+image.name;

    let hashedUserName = SHA256(userName).toString();
    let hashedPassword = SHA256(password).toString();

    let nameValidation = await findValidityOfName(name);
    let userNameValidation = await findValidityOfUserName(hashedUserName);

    if(nameValidation.length == 0){
        if(userNameValidation.length == 0){
                image.mv(`${newImagePath}${newImageName}`,async(err)=>{

                    if(err){
                        res.send({response:false,message:'Failed to register',data:null})
                    }else{
                        let imagePath = `http://localhost:8000/public/images/institutions/${newImageName}`
                        let data = await addNewInstitution(randomInsId,name,hashedUserName,hashedPassword,imagePath,description);
                        req.session.isLogged = true;
                        req.session.institutionId = data[0].id;
                        res.send({response:true,message:'Successfully Registered',data:data[0]});
                    }
                })
        }else{
            res.send({response:false,message:`${userName} is already taken please try different one`,data:null})
        }
    }else{
        res.send({response:false,message:"Institution is already registered",data:null})
    }
    
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

//view the student progress
institutionRouter.get('/conducts',async(req,res)=>{
    if(req.session.isLogged){
        let instId = req.session.institutionId
        let data = await findAllConductsByInstitution(instId);
        if(data.length != 0){
            res.send({response:true,message:'Suucess',data:data})
        }else{
            res.send({response:false,message:"No involvements",data:null})
        }
    }else{
        res.send({response:false,message:'Need to login first',data:null})
    }
})

//the blockchain part
const blockChain = new BlockChain();
blockChain.createMashBlock();
//release certificate for particular student
institutionRouter.post('/release-certificate',async(req,res)=>{

    let {conductId} = req.body;
    let conductData = await findConductById(conductId);
    let courseData = await findCourseByIdForCertificate(conductData[0].course)
    let institutionData = await findInstitutionById(courseData[0].institution)
    let studentData = await getStudentByStudentId(conductData[0].student)
    // console.log("InstitutionData:==",institutionData)
    // console.log("courseData:==",courseData)
if(req.session.isLogged){
    if(conductData[0].certificateId == '0' && conductData[0].complete == 1){
                        let certificateData = uuid()//generate certifcate ID
                        let date = new Date()
                        let newBlock = new Block( 
                        (blockChain.getLatestBlock().index + 1), 
                        date.toUTCString(), 
                        {
                            certificateId: certificateData,
                            studentData:{
                                id:studentData[0].id,
                                name:studentData[0].name,
                                email:studentData[0].email,
                                nic:studentData[0].nic
                            },
                            institutionData:{
                                id: institutionData[0].id,
                                name:institutionData[0].name
                            },
                            courseData:{
                                id:courseData[0].id,
                                name:courseData[0].name
                            }
                        },
                        blockChain.getLatestBlock().hash);

                        //check the chain before add the block
                        if(blockChain.isChainValid()){
                            console.log("PRE-HASH: ",newBlock.preHash)
                            //add the new block to the mongodb
                            block.create({index:newBlock.index,
                                date:newBlock.date,
                                data:newBlock.data,
                                hash:newBlock.hash,
                                preHash:newBlock.preHash})
    
                            //add the new block to the chain
                            blockChain.addBlock(newBlock)
                            //check the chain after add to the block
                            if(blockChain.isChainValid()){

                                let prime_length = 60;
                                let DiffHell = crypto.createDiffieHellman(prime_length);
                                DiffHell.generateKeys('base64');
                                let studentKey = DiffHell.getPublicKey('base64');
                                let institutionKey = DiffHell.getPrivateKey('base64');
                                let hash = SHA256(`${studentKey}${institutionKey}`).toString()

                                let data = await updateCertificateId(conductId,studentKey)
                                if(data.affectedRows){
                                    let afterAddCerificate = await addNewCertificate(institutionKey,hash,studentData[0].nic,certificateData)
                                    if(afterAddCerificate.affectedRows){
                                       res.send({response:true,message:'Success'})
                                    }else{
                                        res.send({response:false,message:'Some server error'})
                                    }
                                }else{
                                    res.send({response:false,message:'Some server error'})
                                }
                            }
                            // console.log(blockChain)
                        }else{
                            console.log("Problem number 0ne")
                        }
    }
    else{
        res.send({response:false,message:'Already issued or not completed',data:null})
    }
}
else{
    res.send({response:false,message:"Please Login First",data:null});
}

})

//certifications verification.....
institutionRouter.post('/certificate-validation',async (req,res)=>{

if(req.session.isLogged){
    let {nic,studentKey} = req.body;
    let hashedNIC = SHA256(nic).toString(); 
    let certificateID = '';

    let allCertificates = await getCerificatesByNIC(hashedNIC);

    if(allCertificates.length != 0){
        allCertificates.map((certificate)=>{
            if(SHA256(`${studentKey}${certificate.institution}`).toString() == certificate.hash){
                certificateID = certificate.certificate;
            }
        })
        if(certificateID != ''){
            let blockDetails = await block.find({})
            let certificateBlock
            blockDetails.map((detail)=>{
                if(detail.data.certificateId = certificateID){
                    certificateBlock = detail
                }
            })
            console.log(blockDetails)
            if(certificateBlock){
                if(certificateBlock.data.institutionData.id == req.session.institutionId){
                    console.log(certificateBlock.data.institutionData.id)
                    res.send({response:true,message:'Verified',data:certificateBlock})
                }else{
                    res.send({response:false,message:'The key you have entered is invalid',data:null})
                }
            }else{
                res.send({response:true,message:"Certificate have but can not retrieve from mongo",data:null})
            }
        }else{
            console.log('Fake key')
            res.send({response:false,message:'The key you have entered is invalid',data:null})
        }
    }else{
        console.log('No matched NIC')
        res.send({response:false,message:'No matched certificates for the NIC',data:null})
    }
}else{
    res.send({response:false,message:"Need to login First"})
}   

})

module.exports = institutionRouter;