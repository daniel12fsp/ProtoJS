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


function makePongFrame(pingPayload){
    if (pingPayload.length >= 126) {
        throw new Error("for pings and pongs, the max payload length is 125");
    }
    if (typeof pingPayload === "string") {
        pingPayload = str2bytes(pingPayload)
    }
    return makeFrame({
        fin: true,
        opcode: OPCODE.PONG,
        payload: pingPayload,
    })
}

function makePingFrame(payload){
    if (payload.length >= 126) {
        throw new Error("for pings and pongs, the max payload length is 125");
    }
    if (typeof pingPayload === "string") {
        pingPayload = str2bytes(pingPayload)
    }
    return makeFrame({
        fin: true,
        opcode: OPCODE.PING,
        payload: encodedPayload,
    })
}

function makeFrame({
    fin,
    opcode,
    payload
}) {
    //TODO support split frames
    const finOpcodeByte = (fin ? 0x80 : 0x00) | opcode; 
    const bufferSize = getFrameSize(payload.length);
    const target = Buffer.allocUnsafe(bufferSize);
    target[0] = finOpcodeByte;
    if (payload.length <= 125) {
        target[1] = payload.length;
    } else
    if (payload.length >= 126 && payload.length <= 65536) {
        // It has 2 bytes more
        target[1] = 126;
        target.writeUInt16BE(payload.length, 2);
    } else
    if (payload.length >= 65536) {
        // It has 8 bytes more
        target[1] = 127;
        target.writeUInt32BE(0, 2);
        target.writeUInt32BE(payload.length, 6);
    } else {
        //TODO make another frame
    }
    return Buffer.concat([target, payload]);
}


module.exports = {
    makeFrameText,
    makeFrame
};
