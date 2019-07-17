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

Check your host and port settings for your ganache.

### Ropsten

Change your infura api key and create `.secret` file on root. So you can deploy the contracts to Ropsten network.

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
