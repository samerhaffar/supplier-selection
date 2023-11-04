// SPDX-License-Identifier: MIT
// Each source file begins by identifying its license
// No license : UNLICENSED
// GNU : GPL-2.0-only
// Apache or MIT : Apache-2.0 OR MIT

pragma solidity >= 0.7.0 < 0.9.0;

contract Test {

    function isEqual(address add1, address add2) public pure returns(bool) {
        if(add1 == add2) {
            return true;
        }
        return false;
    }
}