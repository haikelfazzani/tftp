export const OPCODES = {
  RRQ: 1,
  WRQ: 2,
  DATA: 3,
  ACK: 4,
  ERROR: 5
};

export const ERROR_CODES = {
  0: 'Not defined, see error message (if any).',
  1: 'File not found.',
  2: 'Access violation.',
  3: 'Disk full or allocation exceeded.',
  4: 'Illegal TFTP operation.',
  5: 'Unknown transfer ID.',
  6: 'File already exists.',
  7: 'No such user.',
}

export const MODES = ["netascii", "octet", "mail"]