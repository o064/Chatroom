const path = require("path");
const http = require("http");
const express =require("express");
const socketio = require("socket.io");


const app = express();
const server = http.createServer(app);
const io = socketio(server);

//utils
const formatMessage = require("./utils/messages");
const {UserJoin, getCurrentUser, userLeave,getRoomUsers} = require("./utils/users");
// set static files 
app.use(express.static(path.join(__dirname , "public")));

const botName = "chatBoard bot";
//
io.on("connection", socket => {

    socket.on("joinRoom",({username,room}) =>{
        const user = UserJoin(socket.id,username,room);
        socket.join(user.room);
        // socket.emit() to your client
        // io.emit() to all clients
        socket.emit('message',formatMessage(botName,"welcome to chatroom") );
        // send to all users except you
        socket.broadcast.to(user.room).emit("message", formatMessage(botName,`${username} has joined`));

        //send user and room info
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
          });
    })

    // when disconnect
    socket.on("disconnect", ()=>{
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit( "message",formatMessage(botName,`${user.username} has leaved`));
        }
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
          });
    });
    //listen to message
    socket.on("chatMessage" , (msg)=>{
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit("message", formatMessage(user.username,msg));
    })
    

});
// port 
const PORT =  process.env.PORT||3000 ;
server.listen(PORT ,()=> console.log(`server listening from port ${PORT}`));

