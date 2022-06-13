const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lottery", function () {

  it("Should return the new greeting once it's changed", async function () {
    const Lottery = await ethers.getContractFactory("Lottery");
    const lottery = await Lottery.deploy("Hello, world!");
    await lottery.deployed();

    expect(await lottery.greet()).to.equal("Hello, world!");

    const setGreetingTx = await lottery.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await lottery.greet()).to.equal("Hola, mundo!");
  });
});
