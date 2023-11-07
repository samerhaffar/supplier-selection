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

    function isEqual(address add1, address add2) public pure returns(bool) {
        if(add1 == add2) {
            return true;
        }
        return false;
    }

    function getValues(uint index) public view returns (uint[] memory) {
        return scoresMatrix[index];
    }

}