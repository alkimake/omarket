pragma solidity >=0.4.21 <0.6.0;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract OMarket is Ownable {
  address[] admins;
  event AdminAdded(address adminAddress);
  event AdminRemoved(address adminAddress);

  function addAdmin(address adminAddress)
    public
    onlyOwner
  {
    admins.push(adminAddress);
    emit AdminAdded(adminAddress);
  }

  function isAdmin(address adminAddress)
    private
    view
    returns(bool)
  {
    uint adminLength = admins.length;
    for (uint i = 0; i < adminLength; i++) {
      if (admins[i] == adminAddress) {
        return true;
      }
    }
    return false;
  }

  function isAdmin()
    public
    view
    returns(bool)
  {
    return isAdmin(msg.sender);
  }

  function removeAdmin(address adminToBeDeleted)
    public
    onlyOwner
  {
    require(isAdmin(adminToBeDeleted), "The address is not admin");
    uint indexToBeDeleted;
    uint adminLength = admins.length;
    for (uint i = 0; i < adminLength; i++) {
      if (admins[i] == adminToBeDeleted) {
        indexToBeDeleted = i;
        break;
      }
    }
    if (indexToBeDeleted < adminLength-1 ) {
      admins[indexToBeDeleted] = admins[adminLength - 1];
    }
    delete admins[adminLength - 1];
    admins.length--;
    emit AdminRemoved(adminToBeDeleted);
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
