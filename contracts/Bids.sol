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
    address private immutable authority;
    Users immutable users;
    Products immutable products;
    RFQs immutable rfqs;

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
    
	event BidStatusChange (
		address changedBy,
		uint bidId,
		BID_STATUS prevStatus,
		BID_STATUS newStatus
	);
    
	event OfferStatusChange (
		address changedBy,
		uint offerId,
		BID_STATUS prevStatus,
		BID_STATUS newStatus
	);

    function getAuthority() public view returns(address) {
        return authority;
    }

    function addBid(uint rfqNo, string memory externalId/*, uint[] memory kpiValues*/) canAddBid(rfqNo) public {

		uint bidId = bidIds.length > 0 ? bidIds.length + 1 : 1;
        uint[] memory bidOfferIds; 
        uint[] memory bidProductIds;
        uint[] memory bidFileIds;

        RFQ memory rfq = rfqs.getRFQ(rfqNo);

        Bid memory bid = Bid(bidId, externalId, rfqNo, 0, BID_STATUS.NEW, 0, msg.sender, rfq.buyer, bidProductIds, bidFileIds, bidOfferIds, 0, 1, "", 1, "", 1, "");  

        bids[bidId] = bid;
        bidIds.push(bidId);   

        //addOffer(bidId, kpiValues);

        rfqs.addBidId(bidId, rfqNo);
        //users.addBidId(msg.sender, bidId);

    }

    function addOffer(uint bidId, uint[] memory kpiValues) isCreator(bidId) canAddOffer(bidId) public {
		uint offerId = offerIds.length > 0 ? offerIds.length + 1 : 1;
        uint offerSerialNo = bids[bidId].offerIds.length + 1;
        uint[] memory kpiScores;

        Offer memory offer = Offer(bidId, offerId, BID_STATUS.NEW, 0, offerSerialNo, kpiValues, kpiScores);

        //uint rfqNo = bids[bidId].rfqNo;
        //rfqs.addOfferToRfq(kpiValues, rfqNo, bidId);        

        offers[offerId] = offer;
        offerKpiScores[offerId] = kpiScores;
        offerIds.push(offerId);
        
        bids[bidId].offerIds.push(offerId);
        bids[bidId].latestOfferId = offerId;
    }

    function addBidProduct(uint bidId, uint rfqProductId, uint pricePerUnit, uint leadTime, uint shippingTime, uint inventory, uint customizations, string memory customizationsDescription, uint minQuantity) isCreator(bidId) public {
        
		uint bidProductId = bidProductsIds.length > 0 ? bidProductsIds.length + 1 : 1;

        BidProduct memory bidProduct = BidProduct(bidProductId, bidId, rfqProductId, pricePerUnit, leadTime, shippingTime, inventory, customizations, customizationsDescription, minQuantity);

        bidProducts[bidProductId] = bidProduct;
        bidProductsIds.push(bidProductId);
        bids[bidId].bidProductIds.push(bidProductId);

    }

    function updateBidProduct(uint bidId, uint bidProductId, uint pricePerUnit, uint leadTime, uint shippingTime, uint inventory, uint customizations, string memory customizationsDescription, uint minQuantity) isCreator(bidId) public {
        require(bidId == bidProducts[bidProductId].bidId, "bidId and bidProduct.bidId mismatch.");
        bidProducts[bidProductId].pricePerUnit = pricePerUnit;
        bidProducts[bidProductId].leadTime = leadTime;
        bidProducts[bidProductId].shippingTime = shippingTime;
        bidProducts[bidProductId].inventory = inventory;
        bidProducts[bidProductId].customizations = customizations;
        bidProducts[bidProductId].customizationsDescription = customizationsDescription;
        bidProducts[bidProductId].minQuantity = minQuantity;
    }

    function addBidFile(uint bidId, BID_FILE_TYPE fileType, string memory fileURI) isCreator(bidId) public {

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
        uint bidId = offers[offerId].bidId;
        require(isBuyer(bidId), "pushOfferKpiScore: Only buyer can set offer scores");

        offers[offerId].kpiScores.push(score);
    }

    function setOfferKpiScores(uint offerId, uint[] memory scores) public {
        uint bidId = offers[offerId].bidId;
        require(isBuyer(bidId), "setOfferKpiScores: Only buyer can set offer scores");
        uint arrayLength = scores.length;
        for(uint i = 0; i < arrayLength; i++) {
            offers[offerId].kpiScores[i] = scores[i];
        }
    }

    function clearOfferKpiScores(uint offerId) public {
        uint bidId = offers[offerId].bidId;
        require(isBuyer(bidId), "clearOfferKpiScores: Only buyer can set offer scores");
        while(offers[offerId].kpiScores.length > 0) {
            offers[offerId].kpiScores.pop();
        }
    }

    function setBidScore(uint bidId, uint score) public {
        require(isBuyer(bidId), "setBidScore: Only buyer can set bid scores");
        bids[bidId].score = score;
    }

    function setOfferScore(uint offerId, uint score) public {
        uint bidId = offers[offerId].bidId;
        require(isBuyer(bidId), "setOfferScore: Only buyer can set offer scores");
        offers[offerId].score = score;
    }

    function updateBidStatus(uint bidId, BID_STATUS status) canUpdateStatus(bidId, status) public {
        emit BidStatusChange(msg.sender, bidId, bids[bidId].status, status);
        bids[bidId].status = status;
        uint offerId = bids[bidId].latestOfferId;
        updateOfferStatus(offerId, status);
    }

    function updateOfferStatus(uint offerId, BID_STATUS status) private {
        emit OfferStatusChange(msg.sender, offerId, offers[offerId].status, status);
        offers[offerId].status = status;
    }

    function getBidProduct(uint bidProductId) public view returns(BidProduct memory) {
        return bidProducts[bidProductId];
    }

    function getBidFile(uint bidFileId) public view returns(BidFile memory) {
        return bidFiles[bidFileId];
    }

    function setSellerRating(uint bidId, uint score, string memory comments) isValidNps(score) public {
        require(isBuyer(bidId), "setSellerRating: Only buyer can set seller rating");
        bids[bidId].sellerRating = score;
        bids[bidId].sellerRatingComments = comments;
    }
    function setBuyerRating(uint bidId, uint score, string memory comments) isValidNps(score) public {
        require(isSeller(bidId), "setBuyerRating: Only seller can set buyer rating");
        bids[bidId].buyerRating = score;
        bids[bidId].buyerRatingComments = comments;
    }
    function setAfterSaleRating(uint bidId, uint score, string memory comments) isValidNps(score) public {
        require(isBuyer(bidId), "setAfterSaleRating: Only buyer can set after sale rating");
        bids[bidId].afterSaleRating = score;
        bids[bidId].afterSaleRatingComments = comments;
    }
    function isBuyer(uint bidId) private view returns (bool) {
		address userAddress = msg.sender;
        address bidBuyer = bids[bidId].buyer;
        if(userAddress == bidBuyer) {
            return true;
        }
        return false;
    }
    function isSeller(uint bidId) private view returns (bool) {
		address userAddress = msg.sender;
        address bidSeller = bids[bidId].seller;
        if(userAddress == bidSeller) {
            return true;
        }
        return false;
    }
    function ownsBid(uint bidId, address userAddress) public view returns (bool) {
        if(bids[bidId].seller == userAddress) {
            return true;
        }
        return false;
    }
    function isRfqOpen(uint rfqNo) private view returns(bool) {
        bool isOpen = false;
        RFQ memory rfq = rfqs.getRFQ(rfqNo);
        if((rfq.status == RFQ_STATUS.NEW) || (rfq.status == RFQ_STATUS.AUCTION_BIDDING_OPEN)  || (rfq.status == RFQ_STATUS.BIDDING_OPEN)) {
            isOpen = true;
        }
        require(isOpen, "RFQ status must be NEW, BIDDING_OPEN or AUCTION_BIDDING_OPEN to be able to add a bid or an offer.");
        return isOpen;
    }
	modifier canAddBid(uint rfqNo) {
		address userAddress = msg.sender;
		User memory user = users.getUser(userAddress);
		bool canAdd = false;
		if(user.userAddress == userAddress) {
			if(user.verified) {
				if(user.userType == USER_TYPE.SELLER) {
					canAdd = true;
				}
			}
		}
		require(canAdd, "Cannot add Bid. User does not exist, not verified, or is not a seller.");
        isRfqOpen(rfqNo);
		_;
	}
    modifier canAddOffer(uint bidId) {
        uint rfqNo = bids[bidId].rfqNo;
        isRfqOpen(rfqNo);
        _;
    }
	modifier isCreator(uint bidId) {
		//Bid memory bid = bids[bidId];
		require(bids[bidId].seller == msg.sender, "User not the creator of the Bid");
		_;
	}
    modifier canUpdateStatus(uint bidId, BID_STATUS status) {
        address userAddress = msg.sender;
        bool canUpdate = false;
        string memory message = "No message set";
        if(userAddress == bids[bidId].seller) {
            if((status == BID_STATUS.NEW) || (status == BID_STATUS.SUBMITTED) || (status == BID_STATUS.WITHDRAWN) || (status == BID_STATUS.BUYER_RATED) || (status == BID_STATUS.AUCTION_COUNTEROFFER) ) {
                canUpdate = true;
            } else {
                message = "Only seller can set bid status to NEW, SUBMITTED, WITHDRAWN, BUYER_RATED, AUCTION_COUNTEROFFER";
            }
            
        } else if(userAddress == bids[bidId].buyer) {
            if((status == BID_STATUS.AWARDED) || (status == BID_STATUS.LOST) || (status == BID_STATUS.AUCTION_WON) || (status == BID_STATUS.AUCTION_LOST) || (status == BID_STATUS.SELLER_RATED) || (status == BID_STATUS.AFTER_SALE_RATED) || (status == BID_STATUS.RFQ_COMPLETED) ) {
                canUpdate = true;
            } else {
                message = "Only buyer can set bid status to AWARDED, LOST, AUCTION_WON, AUCTION_LOST, SELLER_RATED, AFTER_SALE_RATED, RFQ_COMPLETED";
            }
            
        } else {
            message = "Only buyer or seller can update a bid's status";
        }
        require(canUpdate, message);
        _;
    }
    modifier isValidNps(uint score) {
        bool validNps = false;
        if(score >= 1 ) {
            if(score <= 10) {
                validNps = true;
            }
        }
        require(validNps, "Rating must be between 1 and 10.");
        _;
    }
    modifier canGetBid(uint bidId) {
        bool can = false;
        if(msg.sender == bids[bidId].buyer) {
            can = true;
        }
        if(msg.sender == bids[bidId].seller) {
            can = true;
        }
        if(msg.sender == authority) {
            can = true;
        }
        require(can, "Only the authority, the buyer and the seller can get a bid's information.");
        _;
    }

}