// SPDX-License-Identifier: MIT
// Each source file begins by identifying its license
// No license : UNLICENSED
// GNU : GPL-2.0-only
// Apache or MIT : Apache-2.0 OR MIT

pragma solidity >= 0.7.0 < 0.9.0;

import { RFQ, RFQKPI, SCORE_RULE, RFQ_STATUS, BID_STATUS, ACTION } from "./Types.sol";
import { RFQs } from "./RFQs.sol";
import { Bids } from "./Bids.sol";

library Utils {
    function checkKPIWeights(RFQ memory rfq, RFQKPI[] memory rfqKpis) private pure returns(bool) {

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

    function compareStrings(string memory a, string memory b) public pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    function combineString(string memory _str1, string memory _str2) public pure returns (string memory){
        // Concat the 2 strings passed
        return string(abi.encodePacked(_str1, " ", _str2));
	}

	function normalizeValues(uint[] memory values, SCORE_RULE rule) public pure returns (uint[] memory) {
		
			uint[] memory normalizedValues = new uint[](values.length);
			
			uint minValue = 11579208923731619542357064039457584007913129639935;

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
		
}


	/**
	 * 
	 * 	function checkKPIWeights(RFQ memory rfq) private view returns(bool) {

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
	 */

    
