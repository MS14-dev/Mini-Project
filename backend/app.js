const express = require('express')
const path = require('path')
const cors = require('cors')
const session = require('express-session')
const {Server} = require('socket.io')
const http = require('http')

const sqlDB = require('./database')


// const studentRouter = require('./routes/studentRouter');
const studentRouter = require('./routes/studentsRoute')
const institutionRouter = require('./routes/institutionsRouter')
const generalRouter = require('./routes/generalRouter')

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
secret:'justastringforhere',
resave:false,
saveUninitialized:true,
cookie:{
    maxAge:60*60*24
}
}))

app.use(cors({
    // origin:'http://localhost:3000',
    // methods:['get','post'],
    credentials:true,
}));

// app.use('/students',studentRouter);
app.use('/student',studentRouter);
app.use('/institution',institutionRouter);
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
    socket.on('backend-load',(x)=>{
        console.log(socket.id)
        io.sockets.emit('frontent-load','hello from backend, What can I do for you!!!')
    })
    socket.on('bot-question',(q)=>{
        let questionArray = q.split(' ');
        let questionArrayLowercase = questionArray.map((text)=>{
            return text.toLowerCase()
        })
        console.log(questionArrayLowercase)
        socket.emit('bot-answer',"Hello Answer from backend!!")
    })
})

server.listen(8000,(err)=>{
    if(err){
        console.log(err)
    }
    console.log("server runs")
})