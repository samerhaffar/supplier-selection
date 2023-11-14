// SPDX-License-Identifier: MIT
// Each source file begins by identifying its license
// No license : UNLICENSED
// GNU : GPL-2.0-only
// Apache or MIT : Apache-2.0 OR MIT

pragma solidity >= 0.7.0 < 0.9.0;
import { Products } from "./Products.sol";
import { Users } from "./Users.sol";
import { User, USER_TYPE, Product, RFQ_STATUS, SCORE_RULE, RFQ, RFQProduct, RFQKPI } from "./Types.sol";


contract RFQs {
    address private authority;
    Users users;
    Products products;

	mapping(uint => RFQ) private rfqs;
	mapping(uint => RFQProduct) private rfqProducts;
	mapping(uint => RFQKPI) private rfqKpis;

	uint[] private rfqNos;
	uint[] private rfqProductsIds;
	uint[] private rfqKpisIds;

	string[] private kpiGroups;
	string[][] private kpiNames;

    constructor(Users _users, Products _products) {
        users = _users;
        products = _products;
        authority = msg.sender;
    }
    function getAuthority() public view returns(address) {
        return authority;
    }

	function initKpiGroup(string memory group, string[] memory kpis) public {
		kpiGroups.push(group);
		kpiNames.push(kpis);
	}
	function getKpis() public view returns (string[][] memory) {
		return kpiNames;
	}
	function getKpiGroups() public view returns(string[] memory) {
		return kpiGroups;
	}
	function addRFQ(string memory docURI, string memory externalId) public 
	//userIsVerified userIsBuyer 
	returns(uint) {

		uint RFQNo = rfqNos.length > 0 ? rfqNos.length + 1 : 1;		
		RFQ_STATUS status = RFQ_STATUS.NEW;
		uint[] memory rfqProductIds;
		uint[] memory rfqKpiIds;
		uint[] memory bidIds;
		//string[] memory productBarcodes;

		RFQ memory rfq = RFQ(RFQNo, externalId, rfqProductIds, rfqKpiIds, msg.sender, status, 0, docURI, bidIds, 0);
		rfqs[RFQNo] = rfq;
		rfqNos.push(RFQNo);

		return RFQNo;
	}

	function addBidId(uint bidId, uint rfqNo) public {
		rfqs[rfqNo].bidIds.push(bidId);
	}

	function addRFQProduct(uint rfqNo, string memory barcode, uint quantity, string memory shipTo, uint idealLeadTime, uint idealShippingTime) public {	
		//userIsVerified 
		//userIsBuyer 
		//validRFQNo(rfqProductArg.rfqNo) 
		//validProductBarcode(rfqProductArg.barcode) 

		//RFQ memory rfq = rfqs[rfqNo];
		//require(rfq.buyer == msg.sender, "User not the creator of the RFQ");
		RFQProduct memory rfqProduct;

		//Generating an Id for the rfqProduct object. Always starts at 1.
		uint rfqProductId = rfqProductsIds.length > 0 ? rfqProductsIds.length + 1 : 1;
		
		//Creting the RFQProduct object.
		rfqProduct = RFQProduct(
			rfqNo, 
			rfqProductId, 
			barcode, 
			quantity, 
			shipTo, 
			idealLeadTime, 
			idealShippingTime
		);
		//adding RFQProduct object to master list and its ids tracker
		rfqProducts[rfqProductId] = rfqProduct;
		rfqProductsIds.push(rfqProductId);
		
		//Linking RFQProduct object to the RFQ object
		rfqs[rfqNo].rfqProductIds.push(rfqProductId);

	}
	function addRfqKpi(uint rfqNo, uint kpiGroupId, uint kpiId, uint weight, SCORE_RULE scoreRule, string memory comments) public 
		//userIsVerified 
		//userIsBuyer 
		//validRFQNo(rfqNo) 
		returns(bool) {

		uint rfqKpiId = rfqKpisIds.length > 0 ? rfqKpisIds.length + 1 : 1;
		uint[] memory offerValues;
		uint[] memory offerScores;

		//Creting the RFQKPI object.
		RFQKPI memory rfqKpi = RFQKPI(rfqNo, rfqKpiId, kpiGroupId, kpiId, weight, offerValues, offerScores, scoreRule, comments);

		rfqKpis[rfqKpiId] = rfqKpi;
		rfqKpisIds.push(rfqKpiId);
		
		rfqs[rfqNo].rfqKpiIds.push(rfqKpiId); 

		return true;
	}
	function addOfferToKpi(uint rfqKpiId, uint value) public {
		rfqKpis[rfqKpiId].offerValues.push(value);
	}

	function getRfqProduct(uint rfqProductId) public view returns (RFQProduct memory) {
		//check whether allowed to retrieve as per RFQ object via canRetrieveRFQ
		return rfqProducts[rfqProductId];
	}

	function getRfqKpi(uint rfqKpiId) public view returns (RFQKPI memory) {
		return rfqKpis[rfqKpiId];
	}
	function getBidIds(uint rfqNo) public view returns(uint[] memory) {
		return rfqs[rfqNo].bidIds;
	}

	function updateRfqStatus(uint rfqNo, RFQ_STATUS rfqStatus) public {
		rfqs[rfqNo].status = rfqStatus;
	}
	function increaseRound(uint rfqNo) public {
		rfqs[rfqNo].round++;
	}
	function getRFQNos() public view 
		//userIsVerified 
		returns(uint[] memory) {
			return rfqNos;
	}
	function getRFQ(uint rfqNo) public view  /*validRFQNo(rfqNo)*/ /*canRetrieveRFQ(RFQNo) //userIsVerified*/returns(RFQ memory) {
			return rfqs[rfqNo];
	}
	function setWinningBidId(uint rfqNo, uint bidId) public {
		rfqs[rfqNo].winningBidId = bidId;
	}
}