0                   1                   2                   3
0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-------+-+-------------+-------------------------------+
|F|R|R|R| opcode|M| Payload len |    Extended payload length    |
|I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
|N|V|V|V|       |S|             |   (if payload len==126/127)   |
| |1|2|3|       |K|             |                               |
+-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
|     Extended payload length continued, if payload len == 127  |
+ - - - - - - - - - - - - - - - +-------------------------------+
|                               |Masking-key, if MASK set to 1  |
+-------------------------------+-------------------------------+
| Masking-key (continued)       |          Payload Data         |
+-------------------------------- - - - - - - - - - - - - - - - +
:                     Payload Data continued ...                :
+ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
|                     Payload Data continued ...                |
+---------------------------------------------------------------+


0x81 fin rsv1 rsv2 rsv3 opcode
0x85 mask payload
0x37 55 - mask
0xfa 250 - mask
0x21 33 - mask
0x3d 61  - mask
0x7f 127 - data - 0x37^0x7f - 48 72
0x9f 159 - data - 0xfa^0x9f - 65 101
0x4d 77 - data - 0x21^0x4d - 6c 108
0x51 81- data - 0x3d^0x51 - 6c 108
0x58 88- data - 0x37^0x58 - 6f 111


-----------------------------------------------------------

0x81 fin rsv1 rsv2 rsv3 opcode
0x05 mask payload
0x48 data
0x65 data
0x6c data
0x6c data
0x6fdata




  // Payload length:  7 bits, 7+16 bits, or 7+64 bits

  // The length of the "Payload data", in bytes: if 0-125, that is the
  // payload length.  If 126, the following 2 bytes interpreted as a
  // 16-bit unsigned integer are the payload length.  If 127, the
  // following 8 bytes interpreted as a 64-bit unsigned integer (the
  // most significant bit MUST be 0) are the payload length.  Multibyte
  // length quantities are expressed in network byte order.  Note that
  // in all cases, the minimal number of bytes MUST be used to encode
  // the length, for example, the length of a 124-byte-long string
  // can't be encoded as the sequence 126, 0, 124.  The payload length
  // is the length of the "Extension data" + the length of the
  // "Application data".  The length of the "Extension data" may be
  // zero, in which case the payload length is the length of the
  // "Application data".
(1 << 7) -2
//   frame-payload-length    = ( %x00-7D ) 0 a 125
//   / ( %x7E frame-payload-length-16 ) 126 a 
//   / ( %x7F frame-payload-length-63 )
//   ; 7, 7+16, or 7+64 bits in length,
//   ; respectively

// frame-payload-length-16 = %x0000-FFFF ; 16 bits in length

// frame-payload-length-63 = %x0000000000000000-7FFFFFFFFFFFFFFF
//   ; 64 bits in length

// 7D 125  0111 1101 em 7bits
// 7E 126  0111 1110 em 7bits+16bits
// 7F 127  0111 1111 em 7bits+64bits

------------------------------------------------

Documentation

https://tools.ietf.org/html/rfc6455#section-5.1
https://hpbn.co/websocket/
https://youtu.be/Ud_xj2BClD0?t=371
https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers#Server_Handshake_Response


0000   81 3a
0000   00 00 03 04 00 06 00 00 00 00 00 00 66 75 08 00
0010   45 00 00 70 87 1b 40 00 40 06 b5 6a 7f 00 00 01
0020   7f 00 00 01 10 68 a7 54 56 2b c8 36 af 7d 58 7f
0030   80 18 01 5e fe 64 00 00 01 01 08 0a d8 4c a9 59
0040   d8 4c a9 58 81 3a 61 5b 22 7b 5c 22 74 79 70 65
0050   5c 22 3a 5c 22 68 61 73 68 5c 22 2c 5c 22 64 61
0060   74 61 5c 22 3a 5c 22 36 37 36 36 39 30 32 34 35
0070   61 34 31 62 32 63 33 63 37 32 65 5c 22 7d 22 5d


 If 126, the following 2 bytes interpreted as a 16-bit unsigned integer are the payload length. 
  If 127, the following 8 bytes interpreted as a 64-bit unsigned integer (the most significant bit MUST be 0) are the payload length