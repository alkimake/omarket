# How to upgrade the contract

Project has upgradebility pattern for unstructured storage. TODO has an item already to improve upgradebility.

```sh
$ npx truffle console
truffle(development)> var accounts = await web3.eth.getAccounts()
truffle(development)> const owner = accounts[0]
truffle(development)> const admin = accounts[1]
truffle(development)> const proxy = await OwnedUpgradeabilityProxy.new({ from: owner })
truffle(development)> let omarket = await OMarket.new({ from: owner })
truffle(development)> await proxy.upgradeTo(omarket.address, { from: owner })
{ tx:
   '0xfdedaef9151d81143271db22f3c156c0d84afe35c3c6913dca2ad808d685285a',
  receipt:
   { transactionHash:
      '0xfdedaef9151d81143271db22f3c156c0d84afe35c3c6913dca2ad808d685285a',
     transactionIndex: 0,
     blockHash:
      '0x74bb34f5e4bd2add75d7fc799c8583284dc7d722cc70c4b0ce91b1efb152ba5e',
     blockNumber: 179,
     from: '0xd265d6b3a95ad0165ada56cae96a823ad1550021',
     to: '0x4227d4dab40eaf3b477a9a165da82bc15c651db2',
     gasUsed: 44959,
     cumulativeGasUsed: 44959,
     contractAddress: null,
     logs: [ [Object] ],
     status: true,
     logsBloom:
      '0x00000000000000000800000000040000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000012000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
     v: '0x1b',
     r:
      '0x0e98ad48c61d9b802fd461696603c01212897a04a4c07cfb4d45a24af171ebc6',
     s:
      '0x76698d98051fe97b6f86e94b9aa8a4ae0e3638e3b7cfe88cff046378270d0d2d',
     rawLogs: [ [Object] ] },
  logs:
   [ { logIndex: 0,
       transactionIndex: 0,
       transactionHash:
        '0xfdedaef9151d81143271db22f3c156c0d84afe35c3c6913dca2ad808d685285a',
       blockHash:
        '0x74bb34f5e4bd2add75d7fc799c8583284dc7d722cc70c4b0ce91b1efb152ba5e',
       blockNumber: 179,
       address: '0x4227d4DAB40eaf3b477A9a165da82Bc15C651Db2',
       type: 'mined',
       id: 'log_09e8f34b',
       event: 'Upgraded',
       args: [Result] } ] }
truffle(development)> omarket = await OMarket.at(proxy.address)
```

Now we have a proxy that translates our requests to the real contract. When we need to update the contract we can simply deploy OMarket and use `proxy.upgradeTo()` function.
