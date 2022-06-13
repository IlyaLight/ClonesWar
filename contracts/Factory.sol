//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
import "./ILotery.sol";

contract Factory is Ownable {
    string private greeting;

    // addresses of original contracts
    mapping(string => address) public originalLotteries;

    // addresses of lotteries
    address[] public lotteries;

    // lottery counter
    uint  public lotteriesCounter = 0;

    event LotteryCreated(address auctionAdress, address owner);

    // add original lottery contract
    function addOriginalLottery(address _originalAddress)
    onlyOwner
    external
    {
        originalLotteries[ILottery(_originalAddress).version()] = _originalAddress;
    }

    // deployment clone lottery
    function createLottery(string memory _lotteryVersion)
    external
    returns (address newLotteryAddress)
    {
        require(originalLotteries[_lotteryVersion] != address(0), 'invalid auction address');
        // deploy clone
        newLotteryAddress = Clones.clone(originalLotteries[_lotteryVersion]);
        require(newLotteryAddress != address(0));
        lotteries.push(newLotteryAddress);
        lotteriesCounter += 1;
        emit LotteryCreated(newLotteryAddress, msg.sender);
    }

    // returns a list of all lottery addresses
    function getAuctions()
    external
    view
    onlyOwner
    returns (address[] memory auctions)
    {
        return lotteries;
    }
}
