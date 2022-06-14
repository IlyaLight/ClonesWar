const { expect, version} = require("chai");
const { ethers } = require("hardhat");

describe("Factory", function () {
  let lottery
  let lotteryClone
  let factory

  before('deploy contracts', async () => {
    const Lottery = await ethers.getContractFactory("Lottery");
    lottery = await Lottery.deploy("Hello, world!");
    await lottery.deployed();

    const Factory = await ethers.getContractFactory("Factory");
    factory = await Factory.deploy();
    await factory.deployed();

    await factory.addOriginalLottery(lottery.address)
  });

  it("Should return the new greeting once it's changed", async function () {
    expect(await lottery.greet()).to.equal("Hello, world!");
    const setGreetingTx = await lottery.setGreeting("Hola, mundo!");
    // wait until the transaction is mined
    expect(await lottery.greet()).to.equal("Hola, mundo!");
  });

  it("Should build the lottery clone", async function () {
    const version = await lottery.version();
    const oldLotteriesCount = await factory.lotteriesCounter()
    expect(oldLotteriesCount).to.equal(0);

    const transaction = await factory.createLottery(version);
    await transaction.wait();
    const newLotteriesCount = await factory.lotteriesCounter()
    expect(newLotteriesCount).to.equal(1);

    const cloneLotteryAddress = await factory.lotteries(newLotteriesCount-1);
    console.log('new lottery address\b', cloneLotteryAddress);

    const Lottery = await ethers.getContractFactory("Lottery");
    lotteryClone = await Lottery.attach(cloneLotteryAddress);
  })

  it("check private greeting value", async function() {
    console.log('lotteryClone version (constant): ', await lotteryClone.version());
    console.log('lottery version (constant): \t', await lottery.version());

    console.log('lotteryClone greet: \t ', await lotteryClone.greet());
    console.log('lottery greet: \t', await lottery.greet());

    let transaction = await lotteryClone.init('clone');
    await transaction.wait();
    // error
    // transaction = await lottery.init('original');
    // await transaction.wait();

    console.log('lotteryClone greet: \t', await lotteryClone.greet());
    console.log('lottery greet: \t', await lottery.greet());

    transaction = await lotteryClone.setGreeting('original');
    await transaction.wait();
    transaction = await lottery.setGreeting('clone');
    await transaction.wait();

    console.log('lotteryClone greet: \t', await lotteryClone.greet());
    console.log('lottery greet: \t', await lottery.greet());
  })

});
