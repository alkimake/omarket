pragma solidity >=0.4.21 <0.6.0;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import { strings } from "./lib/strings.sol";

contract Store is Ownable {
    using strings for *;

	string[] public labels;
	string public name;
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
}
