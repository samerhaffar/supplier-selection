// SPDX-License-Identifier: MIT
// Each source file begins by identifying its license
// No license : UNLICENSED
// GNU : GPL-2.0-only
// Apache or MIT : Apache-2.0 OR MIT

pragma solidity >= 0.7.0 < 0.9.0;

enum USER_TYPE { BUYER, SELLER }
enum RFQ_STATUS {NEW, ACCEPTING_BIDS, REVIEWING, AUCTION_REVIEWING, AUCTION_BIDDING, AWARDED, CANCELED}
enum SCORE_RULE {ASCENDING, DESCENDING}  //Descending means largest value gets highest score; Ascending means lowest value gets highest score
enum BID_FILE_TYPE { TECHNICAL_PROPOSAL, FINANCIAL_PROPOSAL, SIX_SIGMA_CERTIFICATE, QUALITY_CERTIFICATE, SAFETY_CERTIFICATE, ENVIRONMENTAL_AUDIT }
enum BID_STATUS { NEW, SUBMITTED, AUCTION_SUBMITTED, AUCTION_REVIEWED, AWARDED, LOST }

struct User {
    USER_TYPE userType;
    string name;
    address userAddress;
    string contactDetails;
    string[] productBarcodes;
    bool verified;
    uint rating; //updated with each bid	
    uint afterSaleRating; //same as above (for buyers and sellers alike, if they don't provide a rating, theirs would be 1; once they provide, their rating is updated)	
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
        uint[] bidIds;
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
    uint kpiGroupId;
    uint kpiId;
    uint weight;
    SCORE_RULE scoreRule;
    string comments;
    //perhaps we can add "status" which shows us whether active or disabled
}

struct Bid {
    uint bidId;
    string externalId;
    uint rfqId;
    uint score; //the total score for the bid; calculated with the formula: BidScore = Sum(GroupScore*GroupWeight); GroupScore = Sum(KPIScore*KPIWeight)
    BID_STATUS status;
    uint acceptedOfferId;
    address buyer;
    uint[] bidProductIds;
    uint[] bidFileIds;
    uint[] offerIds; 
    uint supplierRating; //set by buyer
    string supplierRatingComments; //set by buyer
    uint buyerRating; 
    string buyerRatingComments; //set by buyer
    uint afterSaleRating; //set by buyer
    string afterSaleRatingComments; //set by buyer
}

//one object per product
//values change to the latest offer; only record of kpi's of each offer are kept
struct BidProduct {

    uint bidProductId;
    uint bidId;
    uint rfqProductId;

    uint pricePerUnit;
    uint leadTime;
    uint shippingTime;
    uint inventory;
    uint customizations;
    uint minQuantity;
}

struct BidFile {
    uint bidFileId;
    uint bidId;
    BID_FILE_TYPE fileType;
    string fileURI;
}

struct Offer {
    uint bidId;
    uint offerId;
    uint offerSerialNo;
    uint[] kpiValues;
    uint[] kpiScores;
}

struct Score {
    uint scoreId; //the score
    uint rfqKpiId; //the kpi we're evaluating
    uint bidId; //the bid
    uint value; // the value calcualted as per the supplier's bid (e.g., their total price, total lead time, total shipping time, etc.)
    uint score; //calculated automaticaly once bidding closes; but then the reviewer has the right to make changes to it and adds comments, in that case automated = false
    bool automated;
    string comments;
}

contract Types {

}