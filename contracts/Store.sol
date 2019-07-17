pragma solidity >=0.4.21 <0.6.0;
pragma experimental ABIEncoderV2;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import { strings } from "./lib/strings.sol";

contract Store is Ownable {
    using strings for *;
    using SafeMath for *;

  string[] public labels;
  string public name;

  uint public idGenerator;

  uint balance = 0;


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
  event LogGetBalance(address owner, uint balance);

  /** @dev This constructor creates a new Store based on parameters
    * @dev This store created with the owner by msg.sender and then transfers
    * ownership to the store owner
    * @param storeOwner owner address of the store
    * @param _name store name
    * @param _labelsSeperatedByCommas label list seperated by commas
    */
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

  /** @dev Adds a product to the store
    * @param name_ Product name
    * @param desc Product description
    * @param image ipfs image hash
    * @param stock current available stock
    * @param price product price
    */
  function addProduct(string memory name_, string memory desc, string memory image, uint stock, uint price)
    public
    onlyOwner
    returns(uint)
  {
    products[idGenerator++] = Product(name_, desc, image, stock, 0, true, price);
    emit LogProductAdded(name_, desc, image, stock, price, idGenerator);
    return idGenerator;
  }

  /** @dev reads the product properties
    * @param productId unique id of product that is going to be read
    */
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

  /** @dev for buying the product by customer
    * @param id unique id of product that is going to be bought
    * @param amount the amount of product wanted to be read
    */
  function buyProducts(uint id, uint amount)
    public
    payable
  {
    Product storage myProduct = products[id];
    require(myProduct.isAvailable, 'Event is not open');
    uint _price = amount*myProduct.price;
    require(msg.value >= _price, 'Insufficiant fund to purchase');
    require(amount <= myProduct.totalStock - myProduct.sales, 'There is not enough ticket to purchase');
    myProduct.buyers[msg.sender] = SafeMath.add(myProduct.buyers[msg.sender], amount);
    myProduct.sales += amount;
    balance += _price;
    uint refund = msg.value - _price;
    msg.sender.transfer(refund);
    emit LogBuyProducts(msg.sender, id, amount);
  }

  /** @dev Serves the info of Store */
  function getInfo()
    public
    view
    returns(string memory, string[] memory)
  {
    return (name, labels);
  }

  /** @dev Retreives current balance */
  function currentBalance()
    public
    view
    onlyOwner
    returns(uint)
  {
    return balance;
  }

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

	//prime the data using the fallback function.
	function() external {
	}
}
