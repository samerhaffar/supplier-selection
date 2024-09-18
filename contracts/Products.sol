// SPDX-License-Identifier: MIT
// Each source file begins by identifying its license
// No license : UNLICENSED
// GNU : GPL-2.0-only
// Apache or MIT : Apache-2.0 OR MIT

pragma solidity >= 0.7.0 < 0.9.0;

struct Product {
    string barcode;
    string name;
    string specsURI;
    address[] suppliers;
}

contract Products {
    address private immutable authority;
    


	mapping(string => Product) private products;
	string[] public barcodes;

    constructor() {
        authority = msg.sender;
    }

    function getAuthority() public view returns(address) {
        return authority;
    }

	function getBarcodes() public view returns(string[] memory) {
		return barcodes;
	}

	function getProduct(string memory barcode) public view returns(Product memory) {
		return products[barcode];
	}

    function addProduct(string memory barcode, string memory name, string memory specsURI) public returns(bool) {
		address supplier = msg.sender;

		if(!compareStrings(products[barcode].barcode, barcode)) {
            address[] memory suppliers;
            products[barcode] = Product(barcode, name, specsURI, suppliers);
			barcodes.push(barcode);
		}
		
		if(!supplierExists(products[barcode], supplier)) {
			products[barcode].suppliers.push(supplier);
		}
	
		return true;
	}

	function supplierExists(Product memory product, address supplierAddress) public pure returns(bool) {
		address[] memory productSuppliers = product.suppliers;
		if(productSuppliers.length == 0) {
			return false;
		}
		uint arrayLength = productSuppliers.length;
		for(uint i = 0; i < arrayLength; i++) {
			if(productSuppliers[i] == supplierAddress) {
				return true;
			}
		}
		return false;
	}

    function barcodeExists(string memory barcode) public view returns (bool) {
		uint arrayLength = barcodes.length;
		for(uint i = 0; i < arrayLength; i++) {
			if(compareStrings(barcodes[i], barcode)) {
				return true;
			}
		}
        return false;
    }

    function compareStrings(string memory a, string memory b) public pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

}