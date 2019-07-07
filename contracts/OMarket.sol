pragma solidity >=0.4.21 <0.6.0;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';

import './Store.sol';

contract OMarket is Ownable, Pausable {
  address[] admins;
  mapping(address => StoreOwner) storeOwners;
  address[] storeOwnersLUT;
  uint STORE_CAP = 5;

  mapping(address => mapping(uint => address)) stores;
  mapping(address => uint) storeIdGenerators;

  event AdminAdded(address adminAddress);
  event AdminRemoved(address adminAddress);
  event StoreOwnerAdded(address storeOwnerAddress);
  event StoreOwnerRemoved(address storeOwnerAddress);
  event LogStoreOwner(address, string, bool);
  event LogStoreOwnerStatusChanged(address storeOwnerAddress, bool isActive);

  event CreatedNewStore(address owner, address store);

  modifier onlyAdmin() {
    require(isAdmin(msg.sender), 'Can not verify admin');
    _;
  }

  modifier onlyStoreOwner() {
    require(isStoreOwner(msg.sender), 'Can not verify store owner');
    _;
  }


  struct StoreOwner {
    address addr;
    string name;
    uint storeCap;
    bool isActive;
  }

  function addAdmin(address adminAddress)
    public
    onlyOwner
    whenNotPaused
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

  function isStoreOwner(address storeOwnerAddress)
    private
    view
    returns(bool)
  {
    uint listLength = storeOwnersLUT.length;
    for (uint i = 0; i < listLength; i++) {
      if (storeOwnersLUT[i] == storeOwnerAddress) {
        return true;
      }
    }
    return false;
  }

  function isStoreOwner()
    public
    view
    returns(bool)
  {
    return isStoreOwner(msg.sender);
  }


  function addStoreOwner(address storeOwnerAddress, string memory name)
    public
    onlyAdmin
    whenNotPaused
  {
    require(!isStoreOwner(storeOwnerAddress), 'This account is already a store owner');
    storeOwnersLUT.push(storeOwnerAddress);
    storeOwners[storeOwnerAddress] = StoreOwner(storeOwnerAddress, name, STORE_CAP, true);
    emit StoreOwnerAdded(storeOwnerAddress);
  }

  function getStoreOwners()
    public
    view
    onlyAdmin
    returns(address[] memory)
  {
    return storeOwnersLUT;
  }

  function readStoreOwner(address storeOwnerAddress)
    public
    view
    onlyAdmin
    returns(address, string memory, bool)
  {
    // return storeOwners[storeOwnerAddress];
    StoreOwner memory seller = storeOwners[storeOwnerAddress];
    address addr = seller.addr;
    string memory name = seller.name;
    bool isActive = seller.isActive;
    return (addr, name, isActive);
  }

  function toggleStoreOwnerStatus(address storeOwnerAddress)
    public
    onlyAdmin
  {
    require(isStoreOwner(storeOwnerAddress), 'Address is not store owner');
    StoreOwner storage seller = storeOwners[storeOwnerAddress];
    seller.isActive = !seller.isActive;
    emit LogStoreOwnerStatusChanged(seller.addr, seller.isActive);
  }

  //TODO: implement removal of store owner

  function addNewStore(string memory name, string memory labels)
    public
    onlyStoreOwner
    returns(address)
  {
    uint nextStoreId = storeIdGenerators[msg.sender]+1;
    if (nextStoreId == STORE_CAP+1) {
      revert('Capped store count for this store owner');
    }
    storeIdGenerators[msg.sender] = nextStoreId;
    Store store = new Store(msg.sender, name, labels);
    stores[msg.sender][nextStoreId] = address(store);
    emit CreatedNewStore(msg.sender, address(store));
    return address(store);
  }

  function getStoresOfOwner(address storeOwnerAddress)
    private
    view
    returns(address[] memory)
  {
    mapping(uint => address) storage storesOfOwner = stores[storeOwnerAddress];
    require(storesOfOwner[1] != address(0), 'Theres is no store for this owner');
    uint count = storeIdGenerators[msg.sender];
    address[] memory rStores = new address[](count);
    for (uint index = 1; index <= count; index++) {
      rStores[index-1] = storesOfOwner[index];
    }
    return rStores;
  }

  function getStores()
    public
    view
    returns(address[] memory)
  {
    return getStoresOfOwner(msg.sender);
  }
}
