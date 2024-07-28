const chatform = document.getElementById("chat-form");
const chatMessage = document.querySelector(".chat-messages");
const socket =io();
const roomName = document.getElementById("room-name");
const usersList = document.getElementById("users");

// get username and room name from url
const { room ,username} = Qs.parse(location.search , {
    ignoreQueryPrefix : true  // to ignore ? %
})

//join chat room 
socket.emit("joinRoom", {username,room});
// get room and users
socket.on("roomUsers",({room,users}) =>{
    OutputRoomName(room);
    OutputUsers(users);


});
//message from the server
socket.on("message" , (msg)=>{
    console.log(msg);
    OutputMessage(msg);

    // scroll down when send a message
    chatMessage.scrollTop= chatMessage.scrollHeight;
})



chatform.addEventListener("submit", (e)=>{
    e.preventDefault();
    //get message
    const msg = e.target.elements.msg.value;
    // emit message to the server
    socket.emit("chatMessage", msg);
    //clear input
    e.target.elements.msg.value="";
    e.target.elements.msg.focus();
})

// outputmessage
function OutputMessage(message){
    const div = document.createElement('div');
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">
            ${message.text}
        </p>`;
    document.querySelector(".chat-messages").appendChild(div);
}
//output room name
function OutputRoomName(room){
    roomName.innerHTML = room;
}
function OutputUsers(users){
    usersList.innerHTML=``;
    users.forEach((user) => {
      const li = document.createElement('li');
      li.innerText = user.username;
      usersList.appendChild(li);
    });
}