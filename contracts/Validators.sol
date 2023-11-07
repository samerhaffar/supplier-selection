// SPDX-License-Identifier: MIT
// Each source file begins by identifying its license
// No license : UNLICENSED
// GNU : GPL-2.0-only
// Apache or MIT : Apache-2.0 OR MIT

pragma solidity >= 0.7.0 < 0.9.0;
import { Products } from "./Products.sol";
import { Users } from "./Users.sol";
import { RFQs } from "./RFQs.sol";
import { Bids } from "./Bids.sol";
import { Auctions } from "./Auctions.sol";

contract Validators {

	function isVerified() public {

	}

	function isBuyer() public {

	}

	function userExists() public {

	}

	function productExists() public {

	}
    
	function canAddBid() public {
		//# kpi values = # kpis
		//sells all products (later, only some of them) of the rfq
		//verified and type is seller
	}

	function canGetBid() public {
		//if authority, owner of rfq, and owner of bid
	}
 
	function valuesForAllKpis() public { //to make sure that values are provided for all rfq's KPIs by the bid

	}

	//because we rely so much on the order of the KPIs, we cannot risk re-initializing them once they're initialized; we can only append new ones, so once initialized, you cannot re-initialize them
	function canInitKpis() public {

	}

	function canAddRfq() public {
		//verified and type is buyer
	}

	function canUpdateRfqStatus() public {
		//only buyer can do that, and not directly, but only through Auction methods
	}

	function canGetRfq() public {
		
	}

	function rfqExists() public {

	}

	function bidExists() public {

	}

    function canRate() public {

    }

    /**
     * 
	modifier userIsVerified {
        if(msg.sender == authority) {
            _;
        }
		require(users.isVerified(msg.sender), "The user is not registered or not verified yet.");
        _;
	}
	modifier userIsBuyer {
        if(msg.sender == authority) {
            _;
        }
		require(users.isBuyer(msg.sender), "User is not a buyer.");
        _;
	}	
	modifier validRFQNo(uint rfqNo) {
		require(rfqNo <= rfqNos.length, "RFQNo not found");
		require(rfqNo > 0, "RFQNo must be more than 1");
		_;
	}
	modifier validProductBarcode(string memory barcode) {
		require(products.barcodeExists(barcode), "Invalid barcode or barcode not found");
		_;
	}
     */

}