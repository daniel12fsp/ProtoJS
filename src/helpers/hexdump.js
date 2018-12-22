function pad(n, width, z = '0') {
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
  function hexdump(buf) {
    let view = new Uint8Array(buf);
    let hex = Array.from(view).map(v => "0x" + pad(v.toString(16), 2));
    return `<Buffer ${hex.join(" ")}>`;
  }
  
  module.exports = hexdump;
