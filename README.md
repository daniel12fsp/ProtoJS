## ProtoJS

ProtoJS is repo for implementation of other protocols like websocket, webrtc, html, html2. If you find a bug, feel free to file a issue.

The first protocol partial supported is websocket. I pretend to implement the missing feature and I accept MR with proper unit test =). 

## Missing features
* Send binary frames
* Send split frames when they are big
* Receive a ping frame with payload
* Send a pong frame with payload
* Add support to  webrtc
* Add CI
* Add on npm

## Example of user

```js
//In Server(Node)
const  {WebSocketServer} = require("../server");
const PORT = 3030;
let server = new WebSocketServer(PORT);
server.onReceive = (msg) => {
    console.log({msg})
}
server.send("Hello World");
```

```js
//in Client(Browser)

const socket = new WebSocket("ws://localhost:3030");
socket.onopen = async () => {
    socket.send("Hi");
};

socket.onmessage = function (event) {
    console.log("onmessage", event.data);
}

```

## API

* onReady() - when client and server is ready to exchange data
* onReceive(data: String) - receive a message
* send(data: String) - send a message to server
* close() - close connection and free socket

# References

https://hpbn.co/websocket/  
https://tools.ietf.org/html/rfc6455#section-5.1  
https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers  
