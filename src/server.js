

const net = require('net');
const hexdump = require('./helpers/hexdump');
const {typeOfFrame} = require('./opcode');
const readFrame = require('./readFrame');
const {makeFrameText} = require('./makeFrame');
const makeHandShake = require('./makeHandShake');

function onSocketData(data){
  global.socket = this;
  global.makeFrame = makeFrameText;
  if (this.status !== 'handshake') {
    console.log(hexdump(data.buffer));
  }
  switch (this.status) {
    case 'handshake':
      makeHandShake(data, this);
      this.status = "data";
      break;
    case 'data':
      handleTypeOfFrames(data, this);
      break;
    default:
      throw new Error("Invalid status");
  }
}

function handleTypeOfFrames(data, socket){
  const fin = (data[0] & 0x80) === 0x80;
  const opcode = typeOfFrame(data[0] & 0x0f);
  switch (opcode) {
    case "continuation":
      //TODO read continuation Frame
      break
    case "text":
      readFrame(data);
      return ;
    case "binary":
      //TODO read binary Frame
      break
    case "connection-close":
      return ;
    case "ping":
      //TODO read send pong Frame
      return ;
    case "pong":
      //TODO read send update last connection
      return ;
    default:
     
  }
}

const clients = {};
//TODO transform this function in class
const server = net.createServer(function (socket) {
  const key = socket.remoteAddress + ":" + socket.remotePort;
  socket.name = key;
  socket.status = 'handshake';
  clients[key] = socket;
  socket.on('data', onSocketData);
  //TODO on close event send a close Frame
});

server.listen(3030, 'localhost');


module.exports = {handleTypeOfFrames};