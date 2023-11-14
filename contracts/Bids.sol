// SPDX-License-Identifier: MIT
// Each source file begins by identifying its license
// No license : UNLICENSED
// GNU : GPL-2.0-only
// Apache or MIT : Apache-2.0 OR MIT

pragma solidity >= 0.7.0 < 0.9.0;
import { Products } from "./Products.sol";
import { Users } from "./Users.sol";
import { RFQs } from "./RFQs.sol";
import { User, USER_TYPE, Product, RFQ_STATUS, SCORE_RULE, RFQ, RFQProduct, RFQKPI, BID_STATUS, BID_FILE_TYPE, Bid, Offer, BidProduct, BidFile } from "./Types.sol";


contract Bids {
    address private authority;
    Users users;
    Products products;
    RFQs rfqs;

	mapping(uint => Bid) private bids;
	mapping(uint => BidProduct) private bidProducts;
	mapping(uint => BidFile) private bidFiles;
	mapping(uint => Offer) private offers;
    mapping(uint => uint[]) private offerKpiScores;

    uint[] private bidIds;
	uint[] private offerIds;
	uint[] private bidProductsIds;
	uint[] private bidFilesIds;

    constructor(Users _users, Products _products, RFQs _rfqs) {
        users = _users;
        products = _products;
        rfqs = _rfqs;
        authority = msg.sender;
    }

    function getAuthority() public view returns(address) {
        return authority;
    }

    function addBid(uint rfqNo, string memory externalId, uint[] memory kpiValues) public {

		uint bidId = bidIds.length > 0 ? bidIds.length + 1 : 1;
        uint[] memory bidOfferIds; 
        uint[] memory bidProductIds;
        uint[] memory bidFileIds;

        Bid memory bid = Bid(bidId, externalId, rfqNo, 0, BID_STATUS.NEW, 0, msg.sender, bidProductIds, bidFileIds, bidOfferIds, 0, 1, "", 1, "", 1, "");  

        bids[bidId] = bid;
        bidIds.push(bidId);   

        addOffer(bidId, kpiValues);

        rfqs.addBidId(bidId, rfqNo);

    }

    function addOffer(uint bidId, uint[] memory kpiValues) public {
		uint offerId = offerIds.length > 0 ? offerIds.length + 1 : 1;
        uint offerSerialNo = bids[bidId].offerIds.length + 1;
        uint[] memory kpiScores;

        Offer memory offer = Offer(bidId, offerId, BID_STATUS.SUBMITTED, 0, offerSerialNo, kpiValues, kpiScores);

        //uint rfqNo = bids[bidId].rfqNo;
        //rfqs.addOfferToRfq(kpiValues, rfqNo, bidId);        

        offers[offerId] = offer;
        offerKpiScores[offerId] = kpiScores;
        offerIds.push(offerId);
        
        bids[bidId].offerIds.push(offerId);
        bids[bidId].latestOfferId = offerId;
    }

    function addBidProduct(uint bidId, uint rfqProductId, uint pricePerUnit, uint leadTime, uint shippingTime, uint inventory, uint customizations, uint minQuantity) public {
        
		uint bidProductId = bidProductsIds.length > 0 ? bidProductsIds.length + 1 : 1;

        BidProduct memory bidProduct = BidProduct(bidProductId, bidId, rfqProductId, pricePerUnit, leadTime, shippingTime, inventory, customizations, minQuantity);

        bidProducts[bidProductId] = bidProduct;
        bidProductsIds.push(bidProductId);
        bids[bidId].bidProductIds.push(bidProductId);

    }

    function addBidFile(uint bidId, BID_FILE_TYPE fileType, string memory fileURI) public {

		uint bidFileId = bidFilesIds.length > 0 ? bidFilesIds.length + 1 : 1;

        BidFile memory bidFile = BidFile(bidFileId, bidId, fileType, fileURI);
        
        bidFiles[bidFileId] = bidFile;
        bidFilesIds.push(bidFileId);
        bids[bidId].bidFileIds.push(bidFileId);

    }

    function getBid(uint bidId) public view returns(Bid memory) {
        return bids[bidId];
    }

    function getBidIds() public view returns(uint[] memory) {
        return bidIds;
    }

    function getOffer(uint offerId) public view returns(Offer memory) {
        return offers[offerId];
    }

    function getOfferIds() public view returns(uint[] memory) {
        return offerIds;
    }

    function pushOfferKpiScore(uint offerId, uint score) public {
        offers[offerId].kpiScores.push(score);
    }

    function setOfferKpiScores(uint offerId, uint[] memory scores) public {
        /*for(uint i = 0; i < offers[offerId].kpiScores.length; i++) {
            delete offers[offerId].kpiScores[i];
        }*/
        for(uint i = 0; i < scores.length; i++) {
            offers[offerId].kpiScores[i] = scores[i];
        }
    }

    function clearOfferKpiScores(uint offerId) public {
        while(offers[offerId].kpiScores.length > 0) {
            offers[offerId].kpiScores.pop();
        }
    }

    function setBidScore(uint bidId, uint score) public {
        bids[bidId].score = score;
    }

    function setOfferScore(uint offerId, uint score) public {
        offers[offerId].score = score;
    }

    function updateBidStatus(uint bidId, BID_STATUS status) public {
        bids[bidId].status = status;
    }

    function updateOfferStatus(uint offerId, BID_STATUS status) public {
        offers[offerId].status = status;
    }

    function getBidProduct(uint bidProductId) public view returns(BidProduct memory) {
        return bidProducts[bidProductId];
    }

    function getBidFile(uint bidFileId) public view returns(BidFile memory) {
        return bidFiles[bidFileId];
    }

    function setSellerRating(uint bidId, uint score, string memory comments) public {
        bids[bidId].sellerRating = score;
        bids[bidId].sellerRatingComments = comments;
    }
    function setBuyerRating(uint bidId, uint score, string memory comments) public {
        bids[bidId].buyerRating = score;
        bids[bidId].buyerRatingComments = comments;
    }
    function setAfterSaleRating(uint bidId, uint score, string memory comments) public {
        bids[bidId].afterSaleRating = score;
        bids[bidId].afterSaleRatingComments = comments;
    }
}