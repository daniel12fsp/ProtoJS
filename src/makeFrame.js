const hexdump = require('./helpers/hexdump');
const {TextEncoder} = require('util');
const {OPCODE} = require("./opcode");

function getFrameSize(length){
    let result = 2; // fin + opcode + mask + payload(-125) bytes

    if (length >= 126 && length < 65536) {
        // It has 2 bytes more
       result +=2
    }
    if (length >= 65536) {
        // It has 8 bytes more
       result +=8
    }
    return result;
}

function str2bytes(payload){
    const enc = new TextEncoder();
    return enc.encode(payload);
}

function makeFrameText(payload){
    return makeFrame({
        fin: true,
        opcode: OPCODE.TEXT,
        payload: str2bytes(payload),
    })
}

function handlePingPongPayload(payload){
    if (payload && payload.length >= 126) {
        throw new Error("for pings and pongs, the max payload length is 125");
    }
    if (typeof payload === "string") {
        payload = str2bytes(payload)
    }
    return payload;
}

function makePongFrame(payload){
    payload = handlePingPongPayload(payload);
    return makeFrame({
        fin: true,
        opcode: OPCODE.PONG,
        payload,
    })
}

function makePingFrame(payload){
    payload = handlePingPongPayload(payload);
    return makeFrame({
        fin: true,
        opcode: OPCODE.PING,
        payload,
    })
}

function makeFrame({
    fin,
    opcode,
    payload
}) {
    //TODO support split frames
    const dataPayloadLength  = (payload && payload.length)|| 0;
    const finOpcodeByte = (fin ? 0x80 : 0x00) | opcode; 
    const target = Buffer.allocUnsafe(getFrameSize(dataPayloadLength));
    target[0] = finOpcodeByte;
    if (dataPayloadLength <= 125) {
        target[1] = dataPayloadLength;
    } else
    if (dataPayloadLength >= 126 && dataPayloadLength <= 65536) {
        // It has 2 bytes more
        target[1] = 126;
        target.writeUInt16BE(dataPayloadLength, 2);
    } else
    if (dataPayloadLength >= 65536) {
        // It has 8 bytes more
        target[1] = 127;
        target.writeUInt32BE(0, 2);
        target.writeUInt32BE(dataPayloadLength, 6);
    } else {
        //TODO make another frame
    }

    if (dataPayloadLength === 0 ) {
        return Buffer.concat([target]);
    } else {
        return Buffer.concat([target, payload]);
    }
}


module.exports = {
    makeFrameText,
    makeFrame,
    makePongFrame,
    makePingFrame
};
