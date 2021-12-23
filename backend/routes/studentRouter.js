const express = require('express');
const fileUpload = require('express-fileupload')
// const multer = require('multer');

const indexRouter = express.Router();

indexRouter.use(fileUpload());
indexRouter.use(express.json())

// var upload = multer({dest:'./public/images/'})

indexRouter.post('/upload',(req,res)=>{
    if(!req.session.isLogged){
        const newFilePath = __dirname + "/../public/images/";
        const file = req.files.file;
        const fileName = new Date().getTime()+file.name;

        file.mv(`${newFilePath}${fileName}`,(err)=>{
        if(err){
            res.send("oops sorry")
        }else{
            req.session.isLogged = true;
            console.log(req.session)
            res.send(`http://localhost:8000/public/images/${fileName}`)
        }
        })
    }else{
        res.send("already logged")
    }
// if(req.file){
//     res.send('Success')
// }else{
//     res.send("fail")
// }
})
indexRouter.get('/',(req,res)=>{
    res.send("localhost 8000")
})

module.exports = indexRouter;
// upload.single('file'),