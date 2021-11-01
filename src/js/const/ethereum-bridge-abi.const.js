export const ethereumBridgeABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_signersRep',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    name: 'hashes',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    name: 'txHashes',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'string',
        name: '_txHash',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'bytes32[]',
        name: '_r',
        type: 'bytes32[]',
      },
      {
        internalType: 'bytes32[]',
        name: '_s',
        type: 'bytes32[]',
      },
      {
        internalType: 'uint8[]',
        name: '_v',
        type: 'uint8[]',
      },
    ],
    name: 'withdrawERC20',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'string',
        name: '_txHash',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '_tokenID',
        type: 'uint256',
      },
      {
        internalType: 'bytes32[]',
        name: '_r',
        type: 'bytes32[]',
      },
      {
        internalType: 'bytes32[]',
        name: '_s',
        type: 'bytes32[]',
      },
      {
        internalType: 'uint8[]',
        name: '_v',
        type: 'uint8[]',
      },
    ],
    name: 'withdrawERC721',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_txHash',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'bytes32[]',
        name: '_r',
        type: 'bytes32[]',
      },
      {
        internalType: 'bytes32[]',
        name: '_s',
        type: 'bytes32[]',
      },
      {
        internalType: 'uint8[]',
        name: '_v',
        type: 'uint8[]',
      },
    ],
    name: 'withdrawNative',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
