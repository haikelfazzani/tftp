import dgram from 'dgram';
import { appendFile } from 'fs/promises';
import { OPCODES } from './contants';

/**
 * TFTP Formats

   Type   Op #     Format without header

          2 bytes    string   1 byte     string   1 byte
          -----------------------------------------------
   RRQ/  | 01/02 |  Filename  |   0  |    Mode    |   0  |
   WRQ    -----------------------------------------------

          2 bytes    2 bytes       n bytes
          ---------------------------------
   DATA  | 03    |   Block #  |    Data    |
          ---------------------------------

          2 bytes    2 bytes
          -------------------
   ACK   | 04    |   Block #  |
          --------------------

          2 bytes  2 bytes        string    1 byte
          ----------------------------------------
   ERROR | 05    |  ErrorCode |   ErrMsg   |   0  |
          ----------------------------------------
 */

let filename = '';
let mode = '';

const server = dgram.createSocket('udp4');

server.on('message', (msg, rinfo) => {

  const operationCode = msg.readUInt16BE(0);

  switch (operationCode) {
    case OPCODES.RRQ:
      filename = msg.toString('ascii', 2, msg.indexOf(0, 2));
      mode = msg.toString('ascii', msg.indexOf(0, 2) + 1, msg.indexOf(0, msg.indexOf(0, 2) + 1));
      handleReadRequest(msg, rinfo);
      break;
    case OPCODES.WRQ:
      filename = msg.toString('ascii', 2, msg.indexOf(0, 2));
      mode = msg.toString('ascii', msg.indexOf(0, 2) + 1, msg.indexOf(0, msg.indexOf(0, 2) + 1));
      handleWriteRequest(msg, rinfo);
      break;
    case OPCODES.DATA:
      console.log('data receiving', msg);
      handleData(msg, rinfo);
      break;
    case OPCODES.ACK:
      console.log('OPCODES.ACK ');

      break;
    case OPCODES.ERROR:
      break;
    default:
      break;
  }
});

async function handleData(buff: Buffer, rinfo: dgram.RemoteInfo) {
  const blockNumber = buff.readUint16BE(2)
  const data = buff.subarray(4)

  console.log('\nfilename ===> ', filename, blockNumber);

  await appendFile(filename, new Uint8Array(data), { encoding: 'utf8' });

  server.send(Buffer.from([0, 4, 0, blockNumber]), rinfo.port, rinfo.address, (err) => {
    if (err) console.error(`Failed to send ACK for WRQ: ${err}`);
  });
}

function handleReadRequest(msg: Buffer, rinfo: dgram.RemoteInfo) {
  console.log(`Read request for ${filename} in ${mode} mode`);
}

function handleWriteRequest(msg: Buffer, rinfo: dgram.RemoteInfo) {
  server.send(Buffer.from([0, 4, 0, 0]), rinfo.port, rinfo.address, (err) => {
    if (err) console.error(`Failed to send ACK for WRQ: ${err}`);
  });
}

server.on('error', (err) => {
  console.log(err);
  server.close()
})

export default server