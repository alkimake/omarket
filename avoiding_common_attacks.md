# Avoiding Common Attacks

## Reentrancy

This pattern is used on `Store` contract by changing the balance first before transferring the amount of balance.

Following code is used in `Store` contract;

```sol
  /** @dev Pays the balance to the owner */
  function receiveBalance()
    public
    onlyOwner
  {
    require(balance!=0, 'Account balance is 0');
    uint fund = balance;
    balance = 0;
    msg.sender.transfer(fund);
    emit LogGetBalance(msg.sender, fund);
  }
```

Finished all internal work (ie. state changes) first, and only then calling the external function

It also prevents **Cross-function Reentrancy**

This attack is well documented on
<https://consensys.github.io/smart-contract-best-practices/known_attacks/#reentrancy>

## Integer Overflow and Underflow

To Avoid this attack `Store` contract is used `SafeMath` library to prevent integer overflow, on following code;

```sol
    myProduct.buyers[msg.sender] = SafeMath.add(myProduct.buyers[msg.sender], amount);
```

Open-Zeppelin SafeMath can be found at; <https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/math/SafeMath.sol>

This attack is well documented on
<https://consensys.github.io/smart-contract-best-practices/known_attacks/#integer-overflow-and-underflow>

# DoS with (Unexpected) revert

To prevent this it is avoided combining multiple transfer() calls in a single transaction on `Store` contract.

Balance, buying product and refund is seperated.

This attack is well documented on
<https://consensys.github.io/smart-contract-best-practices/known_attacks/#dos-with-unexpected-revert>
