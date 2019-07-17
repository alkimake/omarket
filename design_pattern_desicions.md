# Design Patterns Implemented

## Access Restriction Pattern

`OMarket` and `Store` contracts have restictions on some methods respectively. Both contracts have `Ownable` pattern that some methods such as adding admins or creating new products are allowed by only the owner of the contract. This `Ownership` also can be transfarrable by the owner of the contract. This transfership is used in `Store` contract.

Also `OMarket` has additional restrictions that only Admins or Store Owners can take some actions.

For ownership it is used custom solutions couple with Open-Zeppelin <https://docs.openzeppelin.org/v2.3.0/access-control#ownership-and-ownable> `Ownable` contract.

Can be found more information about this pattern at; <https://github.com/fravoll/solidity-patterns/blob/master/docs/access_restriction.md>

## Guard Check

Ensure that the behavior of a smart contract and its input parameters are as expected.

Both `OMarket` and `Store` contracts are checking input parameters as expected. Some examples are;

* OMarket

  ```sol
  uint nextStoreId = storeIdGenerators[msg.sender]+1;
  if (nextStoreId == STORE_CAP+1) {
    revert('Capped store count for this store owner');
  }
  ```

* Store

  ```sol
    require(balance!=0, 'Account balance is 0');
  ```

Can be found more information about this pattern at; <https://github.com/fravoll/solidity-patterns/blob/master/docs/guard_check.md>

## Circuit Breaker / Emergency Stop Pattern

Emergency stop pattern is implemented by using Open-Zeppelin `Pausable` <https://docs.openzeppelin.org/v2.3.0/api/lifecycle#pausable> contract on `OMarket`. Contract module which allows children to implement an emergency stop mechanism that can be triggered by an authorized account.

Owner account (Authorized accounts) can `pause` or `unpause` the contract. Also owner can add additional `pauser` roled accounts.
Following methods can be done by only the contract is not `paused` by using the modifier `whenNotPaused`;

* addAdmin
* addStoreOwner
* toggleStoreOwnerStatus
* addNewStore

Can be found more information about this pattern at; <https://github.com/fravoll/solidity-patterns/blob/master/docs/emergency_stop.md>
