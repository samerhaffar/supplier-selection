// SPDX-License-Identifier: MIT
// Each source file begins by identifying its license
// No license : UNLICENSED
// GNU : GPL-2.0-only
// Apache or MIT : Apache-2.0 OR MIT

pragma solidity >= 0.7.0 < 0.9.0;
import { Products } from "./Products.sol";
import { Users } from "./Users.sol";
//import { Utils } from "./Utils.sol";
import { User, USER_TYPE, Product, RFQ_STATUS, SCORE_RULE, RFQ, RFQProduct, RFQKPI } from "./Types.sol";

contract RFQs {
    address private authority;
    Users users;
    Products products;

	mapping(uint => RFQ) private rfqs;
	uint[] private rfqNos;

	mapping(uint => RFQProduct) private rfqProducts;
	mapping(uint => RFQKPI) private rfqKpis;

	uint[] private rfqProductsIds;
	uint[] private rfqKpisIds;

	string[] private kpiNames;

    constructor(Users _users, Products _products) {
        users = _users;
        products = _products;
        authority = msg.sender;
		initKpis();
    }
    function getAuthority() public view returns(address) {
        return authority;
    }
	function initKpis() private returns(bool) {
		kpiNames.push("KPI1");
		kpiNames.push("KPI2");
		kpiNames.push("KPI3");
		kpiNames.push("KPI5");
		kpiNames.push("KPI6");
		kpiNames.push("KPI7");
		kpiNames.push("KPI8");
		kpiNames.push("KPI9");
		kpiNames.push("KPI10");
		return true;
	}
	function getKpis() public view returns (string[] memory) {
		return kpiNames;
	}
	function addRFQ(string memory docURI, string memory externalId) public 
	//userIsVerified userIsBuyer 
	returns(uint) {

		uint RFQNo = rfqNos.length > 0 ? rfqNos.length + 1 : 1;		
		RFQ_STATUS status = RFQ_STATUS.NEW;
		uint[] memory rfqProductIds;
		uint[] memory rfqKpiIds;
		//string[] memory productBarcodes;

		RFQ memory rfq = RFQ(RFQNo, externalId, rfqProductIds, rfqKpiIds, msg.sender, status, docURI);
		rfqs[RFQNo] = rfq;
		rfqNos.push(RFQNo);

		return RFQNo;
	}
	function addRFQProduct(uint rfqNo, string memory barcode, uint quantity, string memory shipTo, uint idealLeadTime, uint idealShippingTime) public 
		//userIsVerified 
		//userIsBuyer 
		//validRFQNo(rfqProductArg.rfqNo) 
		//validProductBarcode(rfqProductArg.barcode) 	
		returns(bool) {

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


		return true;
	}
	function addRfqKpi(uint rfqNo, string memory kpi, uint weight, SCORE_RULE scoreRule, string memory comments) public 
		//userIsVerified 
		//userIsBuyer 
		//validRFQNo(rfqNo) 
		returns(bool) {


		//require(rfq.buyer == msg.sender, "User not the creator of the RFQ");
		//require(checkKPIWeights(rfq), "Sum of KPI weights should not be less, or more, than 1.000");
		
		//Generating an Id for the RFQKPI object. Always starts at 1.
		uint rfqKpiId = rfqKpisIds.length > 0 ? rfqKpisIds.length + 1 : 1;

		//Creting the RFQKPI object.
		RFQKPI memory rfqKpi = RFQKPI(rfqNo, rfqKpiId, kpi, weight, scoreRule, comments);

		//adding RFQKPI object to master list and its ids tracker
		rfqKpis[rfqKpiId] = rfqKpi;
		rfqKpisIds.push(rfqKpiId);
		//Linking RFQKPI object to the RFQ object
		rfqs[rfqNo].rfqKpiIds.push(rfqKpiId); 

		return true;
	}

	function getRfqProduct(uint rfqProductId) public view returns (RFQProduct memory) {
		//check whether allowed to retrieve as per RFQ object via canRetrieveRFQ
		return rfqProducts[rfqProductId];
	}

	function getRfqKpi(uint rfqKpiId) public view returns (RFQKPI memory) {
		return rfqKpis[rfqKpiId];
	}

	function checkKPIWeights(RFQ memory rfq) private view returns(bool) {

		require(rfq.rfqKpiIds.length > 0, "Cannot call checkKPIWeights on RFQ with no KPIs assigned");

		uint totalWeight = 0;
		for(uint i = 0; i < rfq.rfqKpiIds.length; i++) {
			uint rfqKpiId = rfq.rfqKpiIds[i];
			RFQKPI memory rfqKpi = rfqKpis[rfqKpiId];
			totalWeight += rfqKpi.weight;
		}

		if(totalWeight/1000000000000000 != 1000) {
			return false;
		}
		return true;
	}
	function getRFQNos() public view 
		//userIsVerified 
		returns(uint[] memory) {
			return rfqNos;
	}
	function getRFQ(uint rfqNo) public view  validRFQNo(rfqNo) /*canRetrieveRFQ(RFQNo) //userIsVerified*/returns(RFQ memory) {
			return rfqs[rfqNo];
	}
   function compareStrings(string memory a, string memory b) public pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }
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
}