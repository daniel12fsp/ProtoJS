const { WebSocketInternal } = require('../server');
const { str2bytes, makePingFrame, makePongFrame } = require('../makeFrame');

let server;
let socket;
const PORT = 3030;

let fakeServer = (handleSocketConnection) => ({
  listen: () => { },
  handleSocketConnection
})

let createFakeSocket = function () {
  const result = ({
    remoteAddress: "locahost",
    remotePort: Math.random,
    on: (event, func) => {
      result[event] = func
    },
    write: (buffer) => {
      result.lastBuffer = buffer;
    }
  })

  return result;
}

function makeHandShake() {
  const requestClient =
    ["GET /chat HTTP/1.1",
      "Host: example.com:8000",
      "Upgrade: websocket",
      "Connection: Upgrade",
      "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==",
      "Sec-WebSocket-Version: 13"]
      .concat('\r\n')
      .join("\r\n");


  const requestServer =
    ["HTTP/1.1 101 Switching Protocols",
      "Upgrade: websocket",
      "Connection: Upgrade",
      "Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo="]
      .concat('\r\n')
      .join("\r\n");

  expect(socket.status).toBe("handshake");
  socket.data(Buffer.from(str2bytes(requestClient)));
  expect(socket.lastBuffer).toEqual(requestServer);
  expect(socket.status).toBe("data");
}

describe("Test handle different type of frame", () => {
  beforeEach(() => {
    server = new WebSocketInternal(PORT, fakeServer);
    server.onReceive = (buffer) => {
      server.lastReceive = buffer;
    }
    socket = createFakeSocket();
    server.server.handleSocketConnection(socket)
    makeHandShake();
  });

  it('Should be able to read a complete masked text frame', () => {
    socket.data(Buffer.from(new Int8Array([0x81, 0x85, 0x37, 0xfa, 0x21, 0x3d, 0x7f, 0x9f, 0x4d, 0x51, 0x58])));
    expect(server.lastReceive).toEqual("Hello");
  });

  it('Should when receive a ping and send a pong', () => {
    socket.data(makePingFrame());
    expect(socket.lastBuffer).toEqual(makePongFrame());
  });

  it('Should be able to read full message from fragmented frame', () => {
    socket.data(Buffer.from(new Int8Array([0x01, 0x03, 0x48, 0x65, 0x6c])));
    socket.data(Buffer.from(new Int8Array([0x80, 0x02, 0x6c, 0x6f])));
    expect(server.lastReceive).toEqual("Hello");
  });

  xit('Should be able to read a complete binary frame', () => {
  });

  xit('Should be when receive a connection-close and keep status close', () => {
  });
});



