pragma solidity >=0.4.21 <0.6.0;

contract OMarket {

	address public owner;
	address[] admins;

	event AdminAdded(address adminAddress);

	modifier onlyOwner() {
		require(msg.sender == owner, "Only owner can do this action");
		_;
	}
	constructor() public {
		owner = msg.sender;
	}

	function addAdmin(address adminAddress)
		public
		onlyOwner()
	{
		admins.push(adminAddress);
		emit AdminAdded(adminAddress);
	}

	function getAdmins()
		public
		view
		onlyOwner()
		returns(address[] memory)
	{
		return admins;
	}
}
