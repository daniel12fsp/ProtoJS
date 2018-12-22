const {makeFrameText} = require('../makeFrame');
const loren = require('./lorem');
const {TextEncoder} = require('util');

function expectFrameToBeEqual(str, firstBytes){
  const enc = new TextEncoder();
  const nonPayloadBytesBuf =  Buffer.from(new Int8Array(firstBytes));
  const payloadBytesBuf =  enc.encode(str);
  expect(makeFrameText(str)).toEqual(Buffer.concat([nonPayloadBytesBuf, payloadBytesBuf]));
}

describe("Test text Frame", () => {

  it('Should be a valid frame with 7-bit to length payload', () => {
    expectFrameToBeEqual("Hello", [0x81, 0x05]);
    expectFrameToBeEqual(loren.substr(0, 63), [0x81, 0x3f]);
    expectFrameToBeEqual(loren.substr(0, 125), [0x81, 0x7d]);
  });

  it('Should be a valid frame with (7+16)bits to length payload', () => {
    expectFrameToBeEqual(loren.substr(0, 126), [0x81, 0x7e, 0x00, 0x7e]);
    expectFrameToBeEqual(loren.substr(0, 127), [0x81, 0x7e, 0x00, 0x7f]);
  });

  it('Should be a valid frame with (7+64)bits to length payload', () => {
    expectFrameToBeEqual(loren.substr(0, 1 << 21), [0x81, 0x7f, 0x00, 0x00, 0x00, 0x00, 0x00, 0x20, 0x00, 0x00]);
  });
});



