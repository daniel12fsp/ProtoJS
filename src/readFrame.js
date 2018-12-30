function readFrame(buf) {
    const enabledMask = (buf[1] & 0x80) === 0x80;
    const payloadLength = buf[1] & 0x7f;
    let mask;
    if (enabledMask) {
      mask = buf.slice(2, 6);
      const maskedByte = buf.slice(6);
      const realPayload = Buffer.allocUnsafe(payloadLength);
      for (let i = 0; i < payloadLength; i++) {
        realPayload[i] = maskedByte[i] ^ mask[i % 4];
      }
      return realPayload;
    }
    return buf.slice(2);
}
module.exports = readFrame;
