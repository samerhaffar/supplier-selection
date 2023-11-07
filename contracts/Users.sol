// SPDX-License-Identifier: MIT
// Each source file begins by identifying its license
// No license : UNLICENSED
// GNU : GPL-2.0-only
// Apache or MIT : Apache-2.0 OR MIT

pragma solidity >= 0.7.0 < 0.9.0;

import {USER_TYPE, User} from "./Types.sol";

contract Users {
    address private authority;

    
	mapping(address => User) public users;
	address[] public userAddresses;

    constructor() {
        authority = msg.sender;
    }

    function getAuthority() public view returns(address) {
        return authority;
    }


    function getUserAddresses() public view returns(address[] memory) {
		return userAddresses;
	}

	function getUser(address userAddress) public view returns(User memory) {
		return users[userAddress];
	}

    function register(USER_TYPE userType, string memory name, string memory contactDetails, string[] memory productBarcodes) public returns (bool) {
		
		users[msg.sender] = User(userType, name, msg.sender, contactDetails, productBarcodes, false, 0, 0);
		if(!userExists(msg.sender)) {
			userAddresses.push(msg.sender);
		}
		
		return true;
	}
    
	function userExists(address userAddress) public view returns(bool) {
		for(uint i = 0; i < userAddresses.length; i++) {
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

    function toggleVerify(address userAddress) public returns (string memory) {
		string memory result = "";

		require(msg.sender == authority);
		
		users[userAddress].verified = !users[userAddress].verified;
		
		return result;		
	}

    function combineString(string memory _str1, string memory _str2) public pure returns (string memory){
        // Concat the 2 strings passed
        return string(abi.encodePacked(_str1, " ", _str2));
    }
}