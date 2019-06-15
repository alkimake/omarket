pragma solidity >=0.4.21 <0.6.0;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract OMarket is Ownable {
  address[] admins;
  event AdminAdded(address adminAddress);

  function addAdmin(address adminAddress)
    public
    onlyOwner
  {
    admins.push(adminAddress);
    emit AdminAdded(adminAddress);
  }

  function getAdmins()
    public
    view
    onlyOwner
    returns(address[] memory)
  {
    return admins;
  }
}
