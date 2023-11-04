// SPDX-License-Identifier: MIT
// Each source file begins by identifying its license
// No license : UNLICENSED
// GNU : GPL-2.0-only
// Apache or MIT : Apache-2.0 OR MIT

pragma solidity >= 0.7.0 < 0.9.0;

enum USER_TYPE { BUYER, SELLER }
enum RFQ_STATUS {NEW, ACCEPTING_BIDS, REVIEWING, AUCTION_REVIEWING, AUCTION_BIDDING, AWARDED, CANCELED}
enum SCORE_RULE {ASCENDING, DESCENDING}  //Descending means largest value gets highest score; Descending means lowest value gets highest score

struct User {
    USER_TYPE userType;
    string name;
    address userAddress;
    string contactDetails;
    string[] productBarcodes;
    bool verified;		
}

struct Product {
    string barcode;
    string name;
    string specsURI;
    address[] suppliers;
}

struct RFQ {
		uint rfqNo;
        string externalId;
		uint[] rfqProductIds; //barcode => RFQProduct object
		//string[] productBarcodes; //although reachable via RFQProduct objects; this makes it more efficient and cheaper for sellsProduct
		uint[] rfqKpiIds; //KPI => RFQKPI object
		address buyer;
		RFQ_STATUS status;
		string docURI;
	}

struct RFQProduct {
    uint rfqNo;
    uint rfqProductId;
    string barcode;
    uint quantity;
    string shipTo; //can we consider this an enum to automate shipping costs when on autopilot
    uint idealLeadTime; //could be number for days
    uint idealShippingTime; //could be number for days
    //perhaps we can add "status" which shows us whether active or disabled

}

struct RFQKPI {
    uint rfqNo;
    uint rfqKpiId;
    string kpi;
    uint weight;
    SCORE_RULE scoreRule;
    string comments;
    //perhaps we can add "status" which shows us whether active or disabled
}
contract Types {

}