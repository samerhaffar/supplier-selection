// SPDX-License-Identifier: MIT
// Each source file begins by identifying its license
// No license : UNLICENSED
// GNU : GPL-2.0-only
// Apache or MIT : Apache-2.0 OR MIT

pragma solidity >= 0.7.0 < 0.9.0;
import { Products } from "./Products.sol";
import { Users } from "./Users.sol";
import { RFQs } from "./RFQs.sol";
//import { Utils } from "./Utils.sol";
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

        Bid memory bid = Bid(bidId, externalId, rfqNo, 0, BID_STATUS.NEW, 0, msg.sender, bidProductIds, bidFileIds, bidOfferIds, 1, "", 1, "", 1, "");  


        bids[bidId] = bid;
        bidIds.push(bidId);   

        addOffer(bidId, kpiValues);

        rfqs.addBidId(bidId, rfqNo);

    }

    function addOffer(uint bidId, uint[] memory kpiValues) public {
		uint offerId = offerIds.length > 0 ? offerIds.length + 1 : 1;
        uint offerSerialNo = bids[bidId].offerIds.length + 1;
        uint[] memory kpiScores;

        Offer memory offer = Offer(bidId, offerId, offerSerialNo, kpiValues, kpiScores);

        offers[offerId] = offer;
        offerIds.push(offerId);
        
        bids[bidId].offerIds.push(offerId);
        bids[bidId].score = 500;

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

    function getBidProduct(uint bidProductId) public view returns(BidProduct memory) {
        return bidProducts[bidProductId];
    }

    function getBidFile(uint bidFileId) public view returns(BidFile memory) {
        return bidFiles[bidFileId];
    }
}