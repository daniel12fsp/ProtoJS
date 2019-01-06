const  {WebSocketServer} = require("../server");
const PORT = 3030;
let server = new WebSocketServer(PORT);
server.onReceive = (msg) => {
    console.log("-".repeat(10))
    console.log("Receive", msg)
}
server.onReady = () => {
    server.send("Hello World");
}

/*
In browser(client):

const socket = new WebSocket("ws://localhost:3030");
socket.onopen = async () => {
    socket.send("Hi");
};

socket.onmessage = function (event) {
    console.log("onmessage", event.data);
}

*/