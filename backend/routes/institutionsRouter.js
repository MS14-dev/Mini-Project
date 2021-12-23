const express = require('express');
const {v4:uuid} = require('uuid')
const {SHA256} = require('crypto-js')

const {addNewInstitution,findInstitutionByUserName} = require('../dbRoutes/institutions')

const institutionRouter = express.Router();

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



module.exports = institutionRouter;