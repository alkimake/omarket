pragma solidity >=0.4.21 <0.6.0;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import { strings } from "./lib/strings.sol";

contract Store is Ownable {
    using strings for *;

  string[] public labels;
  string public name;

  uint public idGenerator;


  struct Product {
    string name;
    string description;
    string imageURL;
    uint totalStock;
    uint sales;
    bool isAvailable;
    mapping(address => uint) buyers;
  }

  mapping (uint => Product) products;

  event LogProductAdded(string name, string desc, string imageURL, uint totalStock, uint productId);

  constructor (address storeOwner, string memory _name, string memory _labelsSeperatedByCommas)
    public
  {
    name = _name;
    strings.slice memory s = _labelsSeperatedByCommas.toSlice();
    strings.slice memory delim = ",".toSlice();
    string[] memory labels_ = new string[](s.count(delim) + 1);
    for(uint i = 0; i < labels_.length; i++) {
      labels_[i] = s.split(delim).toString();
    }
    labels = labels_;
    transferOwnership(storeOwner);
  }

  function addProduct(string memory name_, string memory desc, string memory image, uint stock)
    public
    onlyOwner
    returns(uint)
  {
    products[idGenerator++] = Product(name_, desc, image, stock, 0, true);
    emit LogProductAdded(name_, desc, image, stock, idGenerator);
    return idGenerator;
  }


}
