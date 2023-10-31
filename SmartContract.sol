// SPDX-License-Identifier: MIT
// Each source file begins by identifying its license
// No license : UNLICENSED
// GNU : GPL-2.0-only
// Apache or MIT : Apache-2.0 OR MIT

pragma solidity >= 0.7.0 < 0.9.0;

//import "@openzeppelin/contracts/utils/Strings.sol";

contract SmartContract {
    address private authority;

    constructor() {
        authority = msg.sender;
    }

    function getAuthority() public view returns(address) {
        return authority;
    }
	enum USER_TYPE { BUYER, SELLER }
	
	struct Product {
		string barcode;
		string name;
		string specsURI;
		address[] suppliers;
	}
	
	struct User {
		USER_TYPE userType;
		string name;
		address userAddress;
		string contactDetails;
		string[] productBarcodes;
		bool verified;		
	}
	
	mapping(address => User) private users;
	mapping(string => Product) private products;

	address[] public userAddresses;
	string[] public barcodes;


	function getUserAddresses() public view returns(address[] memory) {
		return userAddresses;
	}

	function getUser(address userAddress) public view returns(User memory) {
		return users[userAddress];
	}

	function getBarcodes() public view returns(string[] memory) {
		return barcodes;
	}

	function getProduct(string memory barcode) public view returns(Product memory) {
		return products[barcode];
	}

    /*function getUsers() public pure returns(mapping(address => User) memory) {
        return users;
    }*/
	
	//Also updates the user's information if the sender was the same; however, can only add to the product list, cannot remove, will require revalidation. A separate update function was not implemented because it was outside the scope of the research project.
	function register(USER_TYPE userType, string memory name, string memory contactDetails, string[] memory productBarcodes) public returns (User memory) {
		
		users[msg.sender] = User(userType, name, msg.sender, contactDetails, productBarcodes, false);
		if(!userExists(msg.sender)) {
			userAddresses.push(msg.sender);
		}
		
		return users[msg.sender];
	}

    function pushUser() private returns(bool) {}
	
	function addProduct(string memory barcode, string memory name, string memory specsURI) public returns(Product memory ) {
		address supplier = msg.sender;

		if(!compareStrings(products[barcode].barcode, barcode)) {
            address[] memory suppliers;
            products[barcode] = Product(barcode, name, specsURI, suppliers);
			barcodes.push(barcode);
		}
		
		if(!supplierExists(products[barcode], supplier)) {
			products[barcode].suppliers.push(supplier);
		}
	
		return products[barcode];
	}

	function supplierExists(Product memory product, address supplierAddress) public pure returns(bool) {
		address[] memory productSuppliers = product.suppliers;
		for(uint i = 0; i < productSuppliers.length; i++) {
			if(productSuppliers[i] == supplierAddress) {
				return true;
			}
		}
		return false;
	}

	function userExists(address userAddress) public view returns(bool) {
		for(uint i = 0; i < userAddresses.length; i++) {
			if(userAddresses[i] == userAddress) {
				return true;
			}
		}
	}
	
	function verify(address userAddress) public returns (string memory) {
		string memory result = "";

		require(msg.sender == authority);
		
		users[userAddress].verified = true;
		
		return result;		
	}

    function compareStrings(string memory a, string memory b) public pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

	
	

}

