var DeedRepository = artifacts.require("./DeedRepository.sol");
const fs = require('fs');

contract('DeedRepository', async (accounts) => {
    
    let instance;
    let auctionContractAddress = "";

    beforeEach('setup contract for each test', async function () {
        instance = await DeedRepository.deployed();
        auctionContractAddress = accounts[0];
    })

    it("It should create an deed repository with UANFT as symbol", async () => {
        let symbol = await instance.symbol();
        assert.equal(symbol.valueOf(), 'UANFT' , `Deedrepository symbol should be UANFT`);
    });

    it("It should register a deed with id: 0", async () => {
        await instance.registerDeed(10);
        let ownerOfDeed = await instance.exists(0);
        assert.equal(ownerOfDeed.valueOf(), true , `Result should be true`);
    });

    it(`It should check owner of 0 who is ${accounts[0]}`, async () => {
        let ownerOfDeed = await instance.ownerOf(0);
        assert.equal(ownerOfDeed.valueOf(), accounts[0] , `Owner should be ${accounts[0]}`);
    });

    it(`It should check balance of ${accounts[0]}`, async () => {
        let balance = await instance.balanceOf(accounts[0]);
        assert.equal(balance.valueOf(), 1 , `balance ${balance} should be 1`);
    });

    it(`It should check total supply of the repository`, async () => {
        let supply = await instance.totalSupply();
        assert.equal(supply.valueOf(), 1 , `total supply: ${supply} should be 1`);
    });

    it(`It should approve transfer the ownership of 0 to the auctionRepository address`, async () => {
        await instance.approve(accounts[1], 0);
        // console.log('this auction address:', auctionAddress, ' deedrepo instance addr', instance.address);
        let address = await instance.getApproved(0);
         assert.equal(address.valueOf(), accounts[1], `${address} should be equal to ${auctionContractAddress}`);
    });

    it("It should transfer ownership of deed 0 to this contract", async () => {
        await instance.transferFrom( accounts[0] ,accounts[1], 0, { from: accounts[0]});
        let newOwnerAddress = await instance.ownerOf(0);
        //let success = await instance.isApprovedOrOwner(auctionAddress, 0)
        assert.equal(newOwnerAddress.valueOf(), accounts[1], `${newOwnerAddress} should be ${auctionContractAddress}`);
    });


});