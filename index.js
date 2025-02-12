const http = require("http");
const express= require("express");
const cors = require("cors");
const socketIO = require("socket.io");
require('dotenv').config()

const app = express();
const port = process.env.PORT;

const users=[{}];

app.use(cors());
app.get("/",(req, res)=>{
    res.send("HELL Its Working");
})

const server=http.createServer(app);

const io=socketIO(server);

io.on("connection",(socket)=>{
    console.log("new Connection")

    socket.on('joined',({user})=>{
        users[socket.id]=user;
        console.log(`${user} has joined`)
        socket.broadcast.emit('userJoined',{user:"Admin",message:`${users[socket.id]} has joined`});
        socket.emit('Welcome',{user:"Admin",message:`welcome to the chat, ${users[socket.id]}`})
    })

    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id] ,message,id})

    })

    socket.on('user_disconnect',()=>{
        socket.broadcast.emit('Leave',{user:"Admin",message:`${users[socket.id]} has left`});
        console.log('user Left');
    })

});

server.listen(process.env.PORT,()=>{
    console.log(`server is working on ${port}`);
})