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
import { User, USER_TYPE, Product, RFQ_STATUS, SCORE_RULE, RFQ, RFQProduct, RFQKPI } from "./Types.sol";

//IMPORTANT
//==============
//YOU NEED TO IMPLEMNT KPI_GROUP_WEIGHT AND INVESTIGATE WHETHER IT NEEDS TO BE 1, AND WHETHER TOTAL WEIGHT FOR EACH KPI IS 1 WITHIN ITS GROUP OR 1 ACROSS APIS REGARDLESS OF GROUP
//the purpose of GroupWeight is to modify the weights of the KPIs; so it's something that we can add; but let's ignore it for now until auction

//Is there a timelimit for how long there's time before submission closes and review starts?

contract Auctions {
    
    address private authority;
    Users users;
    Products products;
    RFQs rfqs;
    Bids bids;

    constructor(Users _users, Products _products, RFQs _rfqs, Bids _bids) {
        users = _users;
        products = _products;
        rfqs = _rfqs;
        bids = _bids;
        authority = msg.sender;
    }

    function getAuthority() public view returns(address) {
        return authority;
    }

    function openBidding(uint rfqNo) public {
        //changes status of the rfq to "accepting bids/open"
        updateRfqStatus(rfqNo, RFQ_STATUS.ACCEPTING_BIDS);

        //emits an event to specific suppliers to bid, those that can supply all products

    }

    function closeBidding(uint rfqNo) public {
        
        //calculates the scores and changes the status + prevents submitting or resubmitting a bid 
        updateRfqStatus(rfqNo, RFQ_STATUS.REVIEWING);
        //automatically score bids according to kpis, criteria and values
        scoreRfq(rfqNo);
        //( uses score()?)
    }

    function scoreRfq(uint rfqNo) public {
        //calculates scores automatically
        //loop through kpis
        //loop through bids
    }

    function scoreBid(uint bidId) public {
        //scores a specific bid, manually or automatically with scoreRfq
    }

    function award() public {
        //awards the winning bid, changes status to awarded, prevents submitting/resubmitting, emits announcement
    }

    function startAuction(uint rfqNo) public {
        //changes status to auction + submits scores
        updateRfqStatus(rfqNo, RFQ_STATUS.AUCTION_BIDDING);
        //( uses score()?)

    }

    function endAuction() public {

    }

    function counteroffer() public {
        //submits another offer
    }

    function rate(uint bidId, USER_TYPE ratingFor, uint rating, string memory comments) public {
        //set rating for bid
        //update ratings for buyers and sellers
        //same as above (for buyers and sellers alike, if they don't provide a rating, theirs would be 1; once they provide, their rating is updated)	
        //emit event
    }

    function updateRfqStatus(uint rfqNo, RFQ_STATUS status) public {

    }


}