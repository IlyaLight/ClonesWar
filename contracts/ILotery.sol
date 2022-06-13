//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "hardhat/console.sol";

interface ILottery {
    function version() external returns(string memory version);
}
