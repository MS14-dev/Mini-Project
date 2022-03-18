const express = require('express')
const path = require('path')
const cors = require('cors')
const session = require('express-session')
const {Server} = require('socket.io')
const http = require('http')
const mongoose = require('mongoose');

const sqlDB = require('./database')
const url='mongodb://localhost:27017/confusion';

const connect = mongoose.connect(url);

connect.then(function(db){
  console.log('Connected correctly to the Mongo server');
},function(err){
  console.log(err);
})

//import database (MySQL) routes
const {addMessage,getMessages} = require('./dbRoutes/chat')

// const studentRouter = require('./routes/studentRouter');
const studentRouter = require('./routes/studentsRoute')
const institutionRouter = require('./routes/institutionsRouter')
const generalRouter = require('./routes/generalRouter')
const adminRouter = require('./routes/adminRouter')

const req = require('express/lib/request')

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
secret:'justastringforhere',
resave:false,
saveUninitialized:true,
cookie:{
    maxAge:60*60*24*1000
}
}))

app.use(cors({
    origin:'http://localhost:3000',
    methods:['get','post'],
    credentials:true,
}));

// app.use('/students',studentRouter);
app.use('/student',studentRouter);
app.use('/institution',institutionRouter);
app.use('/admin',adminRouter);
app.use('/general',generalRouter);

app.use('/public/images',express.static(path.join(__dirname, '/public/images')));

//chat application's socket.io implementation in server side
const server = http.createServer(app);
var io = new Server(server,{
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

io.on('connection',(socket)=>{
    socket.on('send-message-to-backend',async({course,sender,receiver,message})=>{
        console.log(socket.id)
        console.log(message)
        
        let latestMessageSet = await addMessage(course,sender,receiver,message)
        
        //send message to the frontend 
        socket.broadcast.emit('send-message-to-frontend',latestMessageSet)
    })
    socket.on('get-all-chat-from-backend',async ({course,sender,receiver})=>{
        let latestMessageSet = await getMessages(course,sender,receiver)
        socket.emit('send-message-to-frontend',latestMessageSet)
    })
})



server.listen(8000,(err)=>{
    if(err){
        console.log(err)
    }
    console.log("server runs")
})

module.exports = {io}