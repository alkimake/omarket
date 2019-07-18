# oMarket

Open Market Dapp solution written in solidity smart contracts with web client.

This application is an Open Market that consists 3 roles;

- OWNER; Owns the smart contract and can add or remove Admin accounts;
- Admin; Admins are responsible to add, remove store owners.
- Store Owner;
  - Store owners can create stores with labels up to 5
  - Store owners put products into stores by using panel and list them to sell
- Customer; Customers can buy any product that is listed on front page. (Currently only supports buying procedure)

This application is just for self education. And there are (will be) many many mistakes or unfinished business.
Currently i am continuening to discover Dapp environment. Also there is a [TODO](TODO.md) list that i keep.

## Installation

Migrate this repository and install dependencies;

```sh
git clone https://github.com/alkimake/omarket.git
cd omarket
yarn
```

Make alterations in `truffle-config.js`. Currently `truffle-config.js` supports 2 network.

- Development: Ganache Network
- Ropsten: Via infura

### Ganache Network

For development, you need to install and run `ganache-cli` to have a local test network

```sh
$ yarn global add ganache-cli
$ ganache-cli
Ganache CLI v6.4.5 (ganache-core: 2.5.7)
Available Accounts
==================
(0) 0xaeebc0685e3a6d7a08e2a9ff855a4916cd586f9d (~100 ETH)
(1) 0x4be3f7863ad7adda47b2657bffa8d76a3443a1a6 (~100 ETH)
(2) 0x3254d76535d87923b339e7059394cdcb42d754d2 (~100 ETH)
(3) 0x28ee0be50f9909f092ccf11c627ae22b3bed2dc3 (~100 ETH)
(4) 0x855fe8f0d6ca7636eae32345c46b5daf6a3dc955 (~100 ETH)
(5) 0x3065c52cb069858f1ed90cb7efd83e7dc07393c3 (~100 ETH)
(6) 0x43dd7a550cab201fa2e7b5ef3a2fb167c9d03c3f (~100 ETH)
(7) 0x2f3cfe1a5dc81ad7d44bf7a30fbad3da3c325062 (~100 ETH)
(8) 0xb4ebf2991a3fa7aa9124145259d9acda1d8d67a8 (~100 ETH)
(9) 0xbda63d4e7168a62a98426b16e055ed813c6f4f56 (~100 ETH)
Private Keys
==================
(0) 0xf103e25388fd1bb55c037f0aa74d9db429839be718ea99aa26736d47223ac743
(1) 0xc2f58f09d31650cd853c24c40d78e43e82117da32ea495b3c9c7c91baeaadf62
(2) 0x0f70f21672c592abc42b40d070fb429361a08916d71d49e8fdbef1925a86a4a8
(3) 0x1e7f3c8677ae7322c622f95357eed6350a9e1eaebf7ac9b888ae178ed0658fef
(4) 0x80b5e16b030a810624c629eab6aad6fc25106048e0fe136e014df970ccfbd22b
(5) 0xf0d4d510a2d4c115e25db8fc8a24bc07bfabe67354a9f8913cafcdc0c5faaea5
(6) 0xaea3c7f264d242b93d13b3c4b1122f6cd639bcf9aac2dabeba24d707ea264579
(7) 0x1fa7f80bd55d9c3503cea1657f15b90a62659b39c4aa7d9e3d3cf398867e69db
(8) 0xd3bf2b49ef54a7e2013aca5329a9302c4406887154465740b3b4c6087883c351
(9) 0x6569d60e6f08933b0524661d828ccfac8ced1a2e0efdcbb2b13bbc6391bb1de1
HD Wallet
==================
Mnemonic:      ill cotton toilet bounce frost barely fee example famous final vague captain
Base HD Path:  m/44'/60'/0'/0/{account_index}
Gas Price
==================
20000000000
Gas Limit
==================
6721975
Listening on 127.0.0.1:8545
```

Use the mnemonics to get accounts on `metamask`
Check your host and port settings for your ganache.

### Ropsten

Change your infura api key and create `.secret` file on root. So you can deploy the contracts to Ropsten network.

This smart contract is already deployed on `ropsten` network and can be seen on `Etherscan`
<https://ropsten.etherscan.io/tx/0x918440da69059ce18faeb5524179bf33a6fe752c544844d47b390d4e4580f5af>

### Build Contracts

Build contracts;

```sh
yarn build:contracts
```

## Optional

If you need to migrate your contract to the network you should use

```sh
yarn migrate:contracts
```

This command migrates the contracts into `develpment` network (which is served on http://localhost:8545 Ganache Network)

## Run

Environment variables are

| Name                | Mandatory | Default |
|---------------------|-----------|---------|
| APPROVED_NETWORK_ID | x         | 5777    |
| DEPLOYED_ADDRESS    | x         |         |

If you migrate your contracts you don't need to put these env variables. Run directly `yarn dev`

Otherwise;

```sh
$ DEPLOYED_ADDRESS="0x..." APPROVED_NETWORK_ID="1" yarn dev
npx parcel index.html
Server running at http://localhost:1234
✨  Built in 20.94s.
```

Currently supports following Networks;

- **1**: Main Net,
- **2**: Deprecated Morden test network,
- **3**: Ropsten test network,
- **4**: Rinkeby test network,
- **42**: Kovan test network,
- **4447**: Truffle Develop Network,
- **5777**: Ganache Blockchain,
- **666**: Daniel Private Blockchain

Now you can browse `http://localhost:1234` in your browser.

## TEST

You need to run `ganache` to run tests

```sh
$ yarn global add ganache-cli
$ ganache-cli
```

On another terminal you can run

```sh
yarn test:sol
```

`sol` is for solidity. I haven't done anything to test web application client yet.

Sample output can be;
```sh
yarn run v1.16.0
$ truffle test
Compiling your contracts...
===========================
> Compiling ./contracts/Migrations.sol
> Compiling ./contracts/OMarket.sol
> Compiling ./contracts/Store.sol
> Compiling ./contracts/lib/strings.sol
> Compiling openzeppelin-solidity/contracts/access/Roles.sol
> Compiling openzeppelin-solidity/contracts/access/roles/PauserRole.sol
> Compiling openzeppelin-solidity/contracts/lifecycle/Pausable.sol
> Compiling openzeppelin-solidity/contracts/ownership/Ownable.sol

    > compilation warnings encountered:

/home/ake/Projects/blockchain/s/omarket/contracts/Store.sol:2:1: Warning: Experimental features are turned on. Do not use experimental features on live deployments.
pragma experimental ABIEncoderV2;
^-------------------------------^

> Artifacts written to /tmp/test-119617-21412-17b1ykz.yr6
> Compiled successfully using:
   - solc: 0.5.8+commit.23d335f2.Emscripten.clang



  Contract: OMarket
    Setup
      ✓ OWNER should be set to the deploying address
      ✓ PAUSED shoud be set to false (63ms)
      ✓ pause can not be called other than owner (92ms)
    Admin
      ✓ getAdmins should include addmin address (149ms)
      ✓ user should get if user is admin (103ms)
      addAdmin()
        ✓ only the owner should be able to add an admin (257ms)
        ✓ adding an admin should triggger an event (95ms)
        ✓ should revert when contract is in paused state (205ms)
      removeAdmin()
        ✓ should not remove admin if the address is not in admin list (113ms)
        ✓ should remove admin properly (286ms)
        ✓ should remove admin in the middle (479ms)
      StoreOwner
        addStoreOwner()
          ✓ only the admin should be able to add a store owner (286ms)
          ✓ adding an storeOwner should triggger an event (127ms)
          ✓ should not add store owners when contract is paused (286ms)
        has valid storeOwner
          ✓ getStoreOwners should include store owner address (71ms)
          ✓ readStoreOwner should return informations about store owner (77ms)
          ✓ should not add same store owner again (150ms)
          ✓ user should get if user is storeOwner (118ms)
          ✓ can toggle active status (228ms)
          ✓ toggle status should be reverted if the address is not store owner (168ms)
    Stores
      ✓ should create new store from storeOwner (154ms)
      ✓ store list should revert (76ms)
      when created a store
        ✓ store list for owner should contain first store (90ms)
        ✓ can not create more than 5 store (797ms)

  Contract: Store
    Setup
      ✓ OWNER should be set to the deploying address (145ms)
      ✓ Info (72ms)
    Adding product
      ✓ only the owner should be able to add an product (224ms)
      ✓ adding an product should emit an product with the provided product details (71ms)
    readProduct()
      ✓ providing the product Id should return the correct product details (142ms)
    buyProducts()
      ✓ products should only be able to be purchased when they are available (219ms)
      ✓ products should only be able to be purchased when enough value is sent with the transaction (73ms)
      ✓ products should only be able to be purchased when there are enough products remaining (139ms)
      ✓ a LogBuyProducts() event with the correct details should be emitted when products are purchased (61ms)
      Owner balance
        ✓ should have correct balance (128ms)
        ✓ should return correct balance (137ms)


  35 passing (16s)

Done in 25.59s.
```

## Contribution

Anything welcome. Just pick something from [TODO](TODO.md) file. Or use your imagination.
