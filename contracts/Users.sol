// SPDX-License-Identifier: MIT
// Each source file begins by identifying its license
// No license : UNLICENSED
// GNU : GPL-2.0-only
// Apache or MIT : Apache-2.0 OR MIT

pragma solidity >= 0.7.0 < 0.9.0;


import { RFQs } from "./RFQs.sol";
import { Bids } from "./Bids.sol";
import {USER_TYPE, User} from "./Types.sol";

contract Users {
    address private immutable authority;
	Bids  bids;
	RFQs  rfqs;

    
	mapping(address => User) private users;
	address[] private userAddresses;

    constructor() {
        authority = msg.sender;
    }

    function getAuthority() public view returns(address) {
        return authority;
    }

	function setBidsContract(Bids _bids) public {
		bids = _bids;
	}

	function setRfqsContract(RFQs _rfqs) public {
		rfqs = _rfqs;
	}


    function getUserAddresses() public view returns(address[] memory) {
		return userAddresses;
	}

	function getUser(address userAddress) public view returns(User memory) {
		return users[userAddress];
	}

    function register(USER_TYPE userType, string memory name, string memory contactDetails, string[] memory productBarcodes) public returns (bool) {

		uint[] memory bidIds;
		uint[] memory rfqNos;
		
		users[msg.sender] = User(userType, name, msg.sender, contactDetails, productBarcodes, false, 0, 0, bidIds, rfqNos);
		if(!userExists(msg.sender)) {
			userAddresses.push(msg.sender);
		}
		
		return true;
	}

	function addRfqNo(address userAddress, uint rfqNo) isUser(userAddress) ownsRfq(rfqNo) public {
        require(userExists(userAddress), "user does not exist");
		users[userAddress].rfqNos.push(rfqNo);
	}

	function addBidId(address userAddress, uint bidId) isUser(userAddress) ownsBid(bidId) public {
        require(userExists(userAddress), "user does not exist");
		users[userAddress].bidIds.push(bidId);
	}
    
	function userExists(address userAddress) public view returns(bool) {
		uint arrayLength = userAddresses.length;
		for(uint i = 0; i < arrayLength; i++) {
			if(userAddresses[i] == userAddress) {
				return true;
			}
		}
        return false;
	}

    function isVerified(address userAddress) public view returns(bool) {
        require(userExists(userAddress), "user does not exist");

        if(users[userAddress].verified) {
            return true;
        }
        return false;        
    }

    function isBuyer(address userAddress) public view returns(bool) {
        require(userExists(userAddress), combineString(string(abi.encodePacked(userAddress)), "user does not exist"));

        if(users[userAddress].userType == USER_TYPE.BUYER) {
            return true;
        }
        return false;        
    }

    function toggleVerify(address userAddress) isAuthority public returns (string memory) {
		string memory result = "";

		require(msg.sender == authority);
		
		users[userAddress].verified = !users[userAddress].verified;
		
		return result;		
	}
    
	modifier isAuthority() {
		bool isAuth = false;
		if(authority == msg.sender) {
			isAuth = true;
		}
		require(isAuth, "User not authority");
		_;
	}

	modifier ownsBid(uint bidId) {
		require(bids.ownsBid(bidId, msg.sender), "User is not the owner of the bid");
		_;
	}

	modifier ownsRfq(uint rfqNo) {
		require(rfqs.ownsRfq(rfqNo, msg.sender), "User is not the owner of the RFQ");
		_;
	}
    
	modifier isUser(address userAddress) {
		bool isU = false;
		if(userAddress == msg.sender) {
			isU = true;
		}
		require(isU, "msg.sender not the owner of userAddress");
		_;
	}

    function combineString(string memory _str1, string memory _str2) public pure returns (string memory){
        // Concat the 2 strings passed
        return string(abi.encodePacked(_str1, " ", _str2));
    }
}