// SPDX-License-Identifier: MIT
// Each source file begins by identifying its license
// No license : UNLICENSED
// GNU : GPL-2.0-only
// Apache or MIT : Apache-2.0 OR MIT

pragma solidity >= 0.7.0 < 0.9.0;

contract Test {

    /*
    we initiate the kpis array on the RFQ; then, we use the reference to the kpi as a reference to value/score pairs for each kpi at the bid; example
    uint kpis[0] = "totalPrice";
    uint kpis[1] = "totalLeadTime";
    uint kpis[2] = "totalShippingTime";
    uint kpis[3] = "technicalSupport";

    Supplier 1:
    //total price of the supplier's bid
    uint matrix[0][0] = 7490;
    uint matrix[0][1] = 112; //means 0.112

    //total lead time of the supplier's bid
    uint matrix[1][0] = 67;
    uint matrix[1][1] = 489; //means 0.489

    //technical support of the supplier's bid
    uint matrix[3][0] = 1; //as a bool, it's either a 0 for false or 1 for 1
    uint matrix [3][1] = 1000; //means 1.000

    */
    uint[][] scoresMatrix; // 

    constructor() {
        for(uint i = 0; i < 3; i++) {
            scoresMatrix[i][0] = 7490;
            scoresMatrix[i][1] = 112;
        }
    }

    /*
	function getWeights(uint rfqNo) private view returns(uint[] memory) {
		uint[] memory rfqKpiIds = rfqs[rfqNo].rfqKpiIds;
		uint[] memory weights = new uint[](rfqKpiIds.length);
		for(uint i = 0; i < rfqKpiIds.length; i++) {
			uint rfqKpiId = rfqKpiIds[i];
			weights[i] = rfqKpis[rfqKpiId].weight;
		}
		return weights;
	}

    function isEqual(address add1, address add2) public pure returns(bool) {
        if(add1 == add2) {
            return true;
        }
        return false;
    }

    function getValues(uint index) public view returns (uint[] memory) {
        return scoresMatrix[index];
    }

    
	function addOfferToRfq(uint[] memory kpiValues, uint rfqNo, uint bidId) public {
		uint[] memory rfqKpiIds = rfqs[rfqNo].rfqKpiIds;
		uint[] memory bidIds = rfqs[rfqNo].bidIds;
		uint[] memory offerValues = new uint[](rfqs[rfqNo].bidIds.length);
		for(uint i = 0; i < rfqKpiIds.length; i++) {
			uint rfqKpiId = rfqKpiIds[i];
			for(uint j = 0; j < bidIds.length; j++) {
				if(bidId == bidIds[j]) {
					offerValues[j] = kpiValues[i];
				}
			}
			rfqKpis[rfqKpiId].offerValues = offerValues;
		}
		
	}
	function scoreRfq(uint rfqNo) public {
		scoreRfqKpis(rfqNo);
		//scoreRfqBids(rfqNo);
	}
	function scoreRfqBids(uint rfqNo) private {
		uint[]memory bidIds = rfqs[rfqNo].bidIds;
		uint[] memory rfqKpiIds = rfqs[rfqNo].rfqKpiIds;
		uint winnerScore = 0;
		uint winnerBidId = 0;
		for(uint i = 0; i < bidIds.length; i++) {
			uint bidScore = 0;
			for(uint j = 0; j < rfqKpiIds.length; j++) {
				uint rfqKpiId = rfqKpiIds[j];
				uint bidKpiScore = rfqKpis[rfqKpiId].offerScores[i];
				uint kpiWeight = rfqKpis[rfqKpiId].weight;
				bidScore = bidScore + bidKpiScore*kpiWeight;
			}
			if(bidScore > winnerScore) {
				winnerScore = bidScore;
				winnerBidId = bidIds[i];
			}
		}
		rfqs[rfqNo].winningBidId = winnerBidId;
	}
	function scoreRfqKpis(uint rfqNo) private {
		uint[] memory rfqKpiIds = rfqs[rfqNo].rfqKpiIds;
		for(uint i = 0; i < rfqKpiIds.length; i++) {
				uint rfqKpiId = rfqKpiIds[i];
				RFQKPI memory rfqKpi = rfqKpis[rfqKpiId];
				rfqKpis[rfqKpiId].offerScores = normalizeValues(rfqKpi.offerValues, rfqKpi.scoreRule);
		}
	}
	function normalizeValues(uint[] memory values, uint rule) public pure returns (uint[] memory) {
		uint[] memory normalizedValues = new uint[](values.length);
		normalizedValues = values;
		/*uint minValue = 11579208923731619542357064039457584007913129639935;
		uint maxValue = 0;
		//calculate Min(values), Max(values)
		for(uint i = 0; i < values.length; i++) {
			uint value = values[i];
			if(value > maxValue) {
				maxValue = value;
			}
			if(value < minValue) {
				minValue = value;
			}
		}
		//Normalize data
		for(uint i = 0; i < values.length; i++) {
			uint value = values[i];
			normalizedValues[i] = (value - minValue) / (maxValue - minValue);
			if(rule == SCORE_RULE.ASCENDING) {
				//normalizedValues[i] = 1- normalizedValues[i];
			}
		}
		return normalizedValues;
	}
/*
    function scoreRfq(uint rfqNo) public {
        RFQ memory rfq = rfqs.getRFQ(rfqNo);
        uint[] memory rfqKpiIds = rfq.rfqKpiIds;
        uint[] memory bidIds = rfq.bidIds;
        uint[] memory kpiWeights = new uint[](rfqKpiIds.length); //weights of kpis

        //loop through kpiIds of the rfq and score offers for each kpi so that each offer would have a complete offer.kpiScores array
        for(uint i = 0; i < rfqKpiIds.length; i++) {
            RFQKPI memory rfqKpi = rfqs.getRfqKpi(rfqKpiIds[i]);
            SCORE_RULE rule = rfqKpi.scoreRule;
            uint weight = rfqKpi.weight;
            kpiWeights[i] = weight;

            uint[] memory kpiOfferValues = new uint[](bidIds.length); //the offer values for rfqKpi
            uint [] memory kpiOfferScores = new uint[](bidIds.length); //the scores of offers for rfqKpi

            //loop through bids and fetch the offer that corresponds to the current round of auctioning
            for(uint j = 0; j < bidIds.length; j++) {
                Bid memory bid = bids.getBid(bidIds[j]);
                //uint[] memory offerIds = bid.offerIds;
                uint latestOfferId = bid.latestOfferId;
                Offer memory offer = bids.getOffer(latestOfferId);
                kpiOfferValues[j] = offer.kpiValues[i];
            }

            //get scores for all bids by normalizing their values and then calculating scores according to rule
            kpiOfferScores = Utils.normalizeValues(kpiOfferValues, rule);

            //loop through bids and set the score of each offer to the one corresponding to it frrom kpiOfferScores
            for(uint j = 0; j < bidIds.length; j++) {
                Bid memory bid = bids.getBid(bidIds[j]);
                uint latestOfferId = bid.latestOfferId;
                bids.pushOfferKpiScore(latestOfferId, kpiOfferScores[j]);
            }
        }

        //loop through bids and calculate the final score of each bid's offer, set the score to the bid object and to the rfq object as the winning bid
        uint winningScore = 0;
        uint winningBidId = 0;
        uint winningOfferId = 0;
        for(uint i = 0; i < bidIds.length; i++) {

            Bid memory bid = bids.getBid(bidIds[i]);
            uint latestOfferId = bid.latestOfferId;
            Offer memory offer = bids.getOffer(latestOfferId);
            uint[] memory offerScores = offer.kpiScores;
            uint score = 0;

            for(uint j = 0; j < offerScores.length; j++) {
                uint kpiScore = kpiWeights[j] * offerScores[j];
                score = score + kpiScore;
            }

            bids.setBidScore(bidIds[i], score);
            bids.setOfferScore(latestOfferId, score);

            if(score > winningScore) {
                winningScore = score;
                winningBidId = bidIds[i];
                winningOfferId = latestOfferId;
            }

        }
        rfqs.setWinningBidId(rfqNo, winningBidId);
        //
    }
*/
}