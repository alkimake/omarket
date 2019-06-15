pragma solidity >=0.4.21 <0.6.0;

contract OMarket {

	address public owner;
	mapping(uint16 => address) admins;
	uint16 adminCount = 0;

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
		admins[adminCount++] = adminAddress;
	}

	function getAdmins()
		public
		view
		onlyOwner()
		returns(address[] memory)
	{
		address[] memory ret = new address[](adminCount);
		for (uint16 i = 0; i < adminCount; i++) {
			ret[i] = admins[i];
		}
		return ret;
	}
}
