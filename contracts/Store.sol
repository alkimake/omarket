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
    uint price;
    mapping(address => uint) buyers;
  }

  mapping (uint => Product) products;

  event LogProductAdded(string name, string desc, string imageURL, uint totalStock, uint price, uint productId);
  event LogBuyProducts(address buyer, uint productId, uint amount);
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

  function addProduct(string memory name_, string memory desc, string memory image, uint stock, uint price)
    public
    onlyOwner
    returns(uint)
  {
    products[idGenerator++] = Product(name_, desc, image, stock, 0, true, price);
    emit LogProductAdded(name_, desc, image, stock, price, idGenerator);
    return idGenerator;
  }

  function readProduct(uint productId)
    public
    view
    returns(string memory, string memory, string memory, uint, bool, uint)
  {
    string memory name_ = products[productId].name;
    string memory description = products[productId].description;
    string memory imageURL = products[productId].imageURL;
    uint sales = products[productId].sales;
    uint stock = products[productId].totalStock - sales;
    bool isAvailable = products[productId].isAvailable;
    uint price = products[productId].price;
    return(name_, description, imageURL, stock, isAvailable, price);
  }

  function buyProducts(uint id, uint amount)
    public
    payable
  {
    Product storage myProduct = products[id];
    require(myProduct.isAvailable, 'Event is not open');
    uint _price = amount*myProduct.price;
    require(msg.value >= _price, 'Insufficiant fund to purchase');
    require(amount <= myProduct.totalStock - myProduct.sales, 'There is not enough ticket to purchase');
    myProduct.buyers[msg.sender] += amount;
    myProduct.sales += amount;
    uint refund = msg.value - _price;
    msg.sender.transfer(refund);
    emit LogBuyProducts(msg.sender, id, amount);
  }

}