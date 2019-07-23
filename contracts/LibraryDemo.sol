pragma solidity >=0.4.21 <0.6.0;

import 'zeppelin/contracts/math/SafeMath.sol';
import 'zeppelin/contracts/token/ERC20.sol';

/** @dev ExampleCoin is a library demo for EthPM Package.
 * WARNING: It is not related with project
 */
contract ExampleCoin is ERC20 {
  using SafeMath for uint256;
  string public symbol = "EXAMPLE";
  string public name = "ExampleCoin";
  uint8 public decimals = 18;  mapping (address => uint256) balances;
  mapping (address => mapping (address => uint256)) allowed;
  constructor() public {
    balances[msg.sender] = 1000 * (10 ** uint256(decimals));
    totalSupply = 1000 * (10 ** uint256(decimals));
  }
}
