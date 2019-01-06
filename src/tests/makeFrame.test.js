const {makeFrameText,  makePongFrame,  makePingFrame} = require('../makeFrame');
const loren = require('./lorem');
const {TextEncoder} = require('util');

function expectFrameToBeEqual(str, firstBytes){
  const enc = new TextEncoder();
  const nonPayloadBytesBuf =  Buffer.from(new Int8Array(firstBytes));
  const payloadBytesBuf =  enc.encode(str);
  expect(makeFrameText(str)).toEqual(Buffer.concat([nonPayloadBytesBuf, payloadBytesBuf]));
}

describe("Test text Frame", () => {

  it('Should be a valid frame with 7-bit payload length ', () => {
    expectFrameToBeEqual("Hello", [0x81, 0x05]);
    expectFrameToBeEqual(loren.substr(0, 63), [0x81, 0x3f]);
    expectFrameToBeEqual(loren.substr(0, 125), [0x81, 0x7d]);
  });

  it('Should be a valid frame with (7+16)bits payload length ', () => {
    expectFrameToBeEqual(loren.substr(0, 126), [0x81, 0x7e, 0x00, 0x7e]);
    expectFrameToBeEqual(loren.substr(0, 127), [0x81, 0x7e, 0x00, 0x7f]);
  });

  it('Should be a valid frame with (7+64) payload length', () => {
    expectFrameToBeEqual(loren.substr(0, 1 << 21), [0x81, 0x7f, 0x00, 0x00, 0x00, 0x00, 0x00, 0x20, 0x00, 0x00]);
  });
});


describe("Test control Frame", () => {
  it('Should be a valid ping without payload', () => {
    expect(makePingFrame()).toEqual(Buffer.from(new Int8Array([0x89, 0x00])));
  });

  xit('Should be a valid ping with payload', () => {
    //TODO expect ping with payload
  });

  it('Should be a invalid ping', () => {
    expect(() => makePingFrame(loren.substr(0, 127))).toThrowError("for pings and pongs, the max payload length is 125");
  });

  it('Should be a valid pong without payload', () => {
    expect(makePongFrame()).toEqual(Buffer.from(new Int8Array([0x8a, 0x00])));
  });

  xit('Should be a valid pong with payload', () => {
    //TODO expect pong with payload
  });
});
