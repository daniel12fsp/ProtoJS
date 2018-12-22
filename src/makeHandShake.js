const crypto = require('crypto');

function makeHandShake(data, socket) {

    const rawHeader = data.toString();
    const header = convertRawHeader(rawHeader);
    //TODO change for something that works in browser see https://www.npmjs.com/package/sha1
    const key = crypto
      .createHash('sha1')
      .update(header['sec-websocket-key'] + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11', 'binary')
      .digest('base64');
  
    const responseHeaders = [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${key}`
    ];
    socket.write(responseHeaders.concat('\r\n').join('\r\n'));
  }

  function convertRawHeader(header) {
    const objHeader = {};
    const lines = header.split("\r\n");
    lines.shift();
    lines.forEach(line => {
      const [prop, value] = line.split(":");
      if (prop && value)
        objHeader[prop.trim().toLowerCase()] = value.trim();
    });
    return objHeader;
  }
  
  module.exports = makeHandShake;
