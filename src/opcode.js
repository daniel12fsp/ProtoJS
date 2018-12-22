function typeOfFrame(bits) {
  switch (bits) {
    case 0x0:
      return "continuation";
    case 0x1:
      return "text";
    case 0x2:
      return "binary";
    case 0x3:
    case 0x4:
    case 0x5:
    case 0x6:
    case 0x7:
      return "future non-control";
    case 0x8:
      return "connection-close";
    case 0x9:
      return "ping";
    case 0xA:
      return "pong";
    default:
      return "error";
  }
}


const _OPCODE = {
  "CONTINUATION": 0x00,
  "TEXT": 0x01,
  "BINARY": 0x02,
  "CONNECTION-CLOSE": 0x08,
  "PING": 0x09,
  "PONG": 0x0A
}


const handler = {
  get: function (obj, prop) {
    if (obj[prop]) {
      return obj[prop];
    }
    switch (bits) {
      case "future non-control":
        throw new Error("Opcode is not implement");
      default:
        throw new Error("Opcode is invalid");
    }

  }
};

const OPCODE = new Proxy(_OPCODE, handler);



module.exports = {typeOfFrame, OPCODE};
