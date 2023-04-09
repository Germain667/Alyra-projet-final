const BlockCar = artifacts.require("./BlockCar.sol");
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

contract('BlockCar', accounts => {
    const owner = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];
    const user3 = accounts[3];
    const user4 = accounts[4];
    const user5 = accounts[5];
    const address0 = "0x0000000000000000000000000000000000000000";

    const tokenURI = "https://gateway.pinata.cloud/ipfs/QmWn234qiACpaaEm4rEX7qWZJmNqGy4mefQZVaSBZkSsWe";
    const vin ="WBA12345678901234";
    const brand = "BMW";
    const model = "i8";
    const color = "Black";
    const registrationCountry = "France";
    const registrationDate = 10121999;
    const power = 200;
    const expectedTokenId1 = 1;
    const expectedTokenId2 = 2;
    const expectedTokenId3 = 3;

    //-------------------- Function mintCar and getCarNft -------------------------//

    describe("Mint NFT Car", function () {

        beforeEach(async function () {
            BlockCarInstance = await BlockCar.new({from:owner});
        });

        it("should mint a new NFT with the correct metadata and car information", async () => {  
            await BlockCarInstance.mintCar(tokenURI, vin, brand, model, color, power, registrationCountry, registrationDate, { from: user1});
            const carInfo = await BlockCarInstance.getCarNft(new BN(expectedTokenId1));
            expect(carInfo.vin).to.equal(vin);
            expect(carInfo.brand).to.equal(brand);
            expect(carInfo.model).to.equal(model);
            expect(carInfo.color).to.equal(color);
            expect(carInfo.power).to.be.bignumber.equal(new BN(power));
            expect(carInfo.registrationCountry).to.equal(registrationCountry);
            expect(carInfo.registrationDate).to.be.bignumber.equal(new BN(registrationDate));

            expect(carInfo.status.isOnSale).to.be.false;
            expect(carInfo.status.isDelegated).to.be.false;
            expect(carInfo.status.isStolen).to.be.false;
            expect(carInfo.status.isWaitingKyc).to.be.false;
            expect(carInfo.status.isKycDone).to.be.false;
            expect(carInfo.status.isScrapped).to.be.false;

            expect(carInfo.infosForSale.mileage).to.be.bignumber.equal(new BN(0));
            expect(carInfo.infosForSale.price).to.be.bignumber.equal(new BN(0));
            expect(carInfo.infosForSale.country).to.be.empty;
            expect(carInfo.infosForSale.localisation).to.be.empty;
            expect(carInfo.infosForSale.contactDetails).to.be.empty;
        }); 

        it("shouldn't get car information because Id incorrect", async () => {  
            await BlockCarInstance.mintCar(tokenURI, vin, brand, model, color, power, registrationCountry, registrationDate, { from: user1});
            await expectRevert(BlockCarInstance.getCarNft(new BN(3),{ from: address0}),"Id incorrect");
        }); 

        it("should emit an event", async () => {  
            const storeData = await BlockCarInstance.mintCar(tokenURI, vin, brand, model, color, power, registrationCountry, registrationDate, { from: user1});
            expectEvent(storeData, "Minted", { userAddress: user1, tokenURI: tokenURI, nftId: new BN(expectedTokenId1), vin: vin, brand: brand, model: model, color: color, power: new BN(power), registrationCountry: registrationCountry, registrationDate: new BN(registrationDate) });
        }); 

    });

    //-------------------- Function mintCar ---------------------------------//

    describe("Should not mint an NFT", function () {

        const tokenURIEmpty = "";
        const vinEmpty ="";
        const brandEmpty = "";
        const modelEmpty = "";
        const colorEmpty = "";
        const registrationCountryEmpty = "";
        const registrationDateEmpty = 0;
        const powerEmpty = 0;

        beforeEach(async function () {
            BlockCarInstance = await BlockCar.new({from:owner});
        });

        it("should revert beacuse address is bad", async () => {  
            await expectRevert(BlockCarInstance.mintCar(tokenURI, vin, brand, model, color, power, registrationCountry, registrationDate, { from: address0}), "Empty");
        }); 

        it("should revert beacuse tokenURIEmpty", async () => {  
            await expectRevert(BlockCarInstance.mintCar(tokenURIEmpty, vin, brand, model, color, power, registrationCountry, registrationDate, { from: user1}), "Empty");
        }); 

        it("should revert beacuse vinEmpty", async () => {  
            await expectRevert(BlockCarInstance.mintCar(tokenURI, vinEmpty, brand, model, color, power, registrationCountry, registrationDate, { from: user1}), "Empty");
        }); 

        it("should revert beacuse brandEmpty", async () => {  
            await expectRevert(BlockCarInstance.mintCar(tokenURI, vin, brandEmpty, model, color, power, registrationCountry, registrationDate, { from: user1}), "Empty");
        }); 

        it("should revert beacuse modelEmpty", async () => {  
            await expectRevert(BlockCarInstance.mintCar(tokenURI, vin, brand, modelEmpty, color, power, registrationCountry, registrationDate, { from: user1}), "Empty");
        }); 

        it("should revert beacuse colorEmpty", async () => {  
            await expectRevert(BlockCarInstance.mintCar(tokenURI, vin, brand, model, colorEmpty, power, registrationCountry, registrationDate, { from: user1}), "Empty");
        }); 

        it("should revert beacuse powerEmpty", async () => {  
            await expectRevert(BlockCarInstance.mintCar(tokenURI, vin, brand, model, color, powerEmpty, registrationCountry, registrationDate, { from: user1}), "Empty");
        }); 

        it("should revert beacuse registrationCountryEmpty", async () => {  
            await expectRevert(BlockCarInstance.mintCar(tokenURI, vin, brand, model, color, power, registrationCountryEmpty, registrationDate, { from: user1}), "Empty");
        }); 

        it("should revert beacuse registrationDateEmpty", async () => {  
            await expectRevert(BlockCarInstance.mintCar(tokenURI, vin, brand, model, color, power, registrationCountry, registrationDateEmpty, { from: user1}), "Empty");
        }); 

    });

    //-------------------- Some ERC721 functions -------------------------//

    describe("Mint NFT Car and testing some function from ERC721", function () {
        //not really needed to test the ERC721 function
        const tokenId = 1;

        beforeEach(async function () {
            BlockCarInstance = await BlockCar.new({from:owner});
            await BlockCarInstance.mintCar(tokenURI, vin, brand, model, color, power, registrationCountry, registrationDate, { from: user1});
        });

        it("should get the balance", async () => {  
            const balance = await BlockCarInstance.balanceOf(user1, { from: user1});
            expect(balance).to.be.bignumber.equal(new BN(1));
        }); 

        it("should mint a second NFT and get the good balance", async () => {  
            await BlockCarInstance.mintCar(tokenURI, vin, brand, model, color, power, registrationCountry, registrationDate, { from: user1});
            const balance = await BlockCarInstance.balanceOf(user1, { from: user1});
            expect(balance).to.be.bignumber.equal(new BN(2));
        });  

        it("should get the owner", async () => {  
            const ownerOf = await BlockCarInstance.ownerOf(tokenId);
            expect(ownerOf).to.equal(user1);
        }); 

        it("should get  the correct URI", async () => {  
            const tokenURIResult = await BlockCarInstance.tokenURI(tokenId);
            expect(tokenURIResult).to.equal(tokenURI);
        }); 

    });

    //-------------------- Function getCurrentId-------------------------//
    describe("testing getCurrentId", function () {

        beforeEach(async function () {
            BlockCarInstance = await BlockCar.new({from:owner});
            await BlockCarInstance.mintCar(tokenURI, vin, brand, model, color, power, registrationCountry, registrationDate, { from: user1});
        });

        it('returns the current token ID', async function () {
            const tokenId = await BlockCarInstance.getCurrentId();
            expect(tokenId).to.be.bignumber.equal(new BN(expectedTokenId1));
         });

    });

    //-------------------- Function getNftIdsByAddress -------------------------//
    describe("testing getNftIdsByAddress", function () {

        beforeEach(async function () {
            BlockCarInstance = await BlockCar.new({from:owner});
            await BlockCarInstance.mintCar(tokenURI, vin, brand, model, color, power, registrationCountry, registrationDate, { from: user1});
            await BlockCarInstance.mintCar(tokenURI, vin, brand, model, color, power, registrationCountry, registrationDate, { from: user1});
            await BlockCarInstance.mintCar(tokenURI, vin, brand, model, color, power, registrationCountry, registrationDate, { from: user1});
        });

        it('returns the NFT IDs owned by an address', async function () {
            const nftIds = await BlockCarInstance.getNftIdsByAddress(user1);
            const expectedIds = [1, 2, 3];
            const nftIdsAsInt = nftIds.map(id => id.toNumber());
            expect(nftIdsAsInt).to.have.members(expectedIds);
          });

        it('returns an empty array if the address has no NFTs', async function () {
            const nftIds = await BlockCarInstance.getNftIdsByAddress(user2);
            expect(nftIds).to.be.an('array').that.is.empty;
        });

    });

    //-------------------- Function getNftIdsByDelegatorAddress -------------------------//
    describe("testing getNftIdsByDelegatorAddress", function () {

        beforeEach(async function () {
            BlockCarInstance = await BlockCar.new({from:owner});
            await BlockCarInstance.mintCar(tokenURI, vin, brand, model, color, power, registrationCountry, registrationDate, { from: user1});
            await BlockCarInstance.askKyc(expectedTokenId1, { from: user1});
            await BlockCarInstance.kycIsApproved(expectedTokenId1, { from: owner});
            await BlockCarInstance.delegeteCar(user3, expectedTokenId1, { from: user1});

            await BlockCarInstance.mintCar(tokenURI, vin, brand, model, color, power, registrationCountry, registrationDate, { from: user1});
            await BlockCarInstance.askKyc(expectedTokenId2, { from: user1});
            await BlockCarInstance.kycIsApproved(expectedTokenId2, { from: owner});
            await BlockCarInstance.delegeteCar(user3, expectedTokenId2, { from: user1});

            await BlockCarInstance.mintCar(tokenURI, vin, brand, model, color, power, registrationCountry, registrationDate, { from: user1});
            await BlockCarInstance.askKyc(expectedTokenId3, { from: user1});
            await BlockCarInstance.kycIsApproved(expectedTokenId3, { from: owner});
            await BlockCarInstance.delegeteCar(user3, expectedTokenId3, { from: user1});

        });

        it('returns the NFT IDs owned by a delegator address', async function () {
            const nftIds = await BlockCarInstance.getNftIdsByDelegatorAddress(user3);
            const expectedIds = [1,2,3];
            const nftIdsAsInt = nftIds.map(id => id.toNumber());
            expect(nftIdsAsInt).to.have.members(expectedIds);
          });

        it('returns an empty array if the address has no NFTs', async function () {
            const nftIds = await BlockCarInstance.getNftIdsByDelegatorAddress(user2);
            expect(nftIds).to.be.an('array').that.is.empty;
        });

    });

    //-------------------- Function getNftIdsByOnSale -------------------------//
    describe("testing getNftIdsByOnSale", function () {

        beforeEach(async function () {
            BlockCarInstance = await BlockCar.new({from:owner});
            await BlockCarInstance.mintCar(tokenURI, vin, brand, model, color, power, registrationCountry, registrationDate, { from: user1});
            await BlockCarInstance.askKyc(expectedTokenId1, { from: user1});
            await BlockCarInstance.kycIsApproved(expectedTokenId1, { from: owner});
            await BlockCarInstance.carIsForSale(expectedTokenId1,new BN(155000),new BN(17000), "France", "Strasbourg", "Jean 06 56 89 78 45", { from: user1});

            await BlockCarInstance.mintCar(tokenURI, vin, brand, model, color, power, registrationCountry, registrationDate, { from: user1});
            await BlockCarInstance.askKyc(expectedTokenId2, { from: user1});
            await BlockCarInstance.kycIsApproved(expectedTokenId2, { from: owner});
            await BlockCarInstance.carIsForSale(expectedTokenId2,new BN(155000),new BN(17000), "France", "Strasbourg", "Jean 06 56 89 78 45", { from: user1});

            await BlockCarInstance.mintCar(tokenURI, vin, brand, model, color, power, registrationCountry, registrationDate, { from: user1});
            await BlockCarInstance.askKyc(expectedTokenId3, { from: user1});
            await BlockCarInstance.kycIsApproved(expectedTokenId3, { from: owner});
            await BlockCarInstance.carIsForSale(expectedTokenId3,new BN(155000),new BN(17000), "France", "Strasbourg", "Jean 06 56 89 78 45", { from: user1});

        });

        it('returns the NFT IDs fir the car which have the status onSale And kycDone to true', async function () {
            const nftIds = await BlockCarInstance.getNftIdsByOnSale({from: user1});
            const expectedIds = [1,2,3];
            const nftIdsAsInt = nftIds.map(id => id.toNumber());
            expect(nftIdsAsInt).to.have.members(expectedIds);
          });
    });

    //-------------------- Function askKyc -------------------------//
    describe("testing askKyc", function () {

        beforeEach(async function () {
            BlockCarInstance = await BlockCar.new({from:owner});
            await BlockCarInstance.mintCar(tokenURI, vin, brand, model, color, power, registrationCountry, registrationDate, { from: user1});
        });

        it('should have isWaitingKyc to true', async function () {
            await BlockCarInstance.askKyc(expectedTokenId1, { from: user1});
            const carInfo = await BlockCarInstance.getCarNft(new BN(expectedTokenId1));
            expect(carInfo.status.isWaitingKyc).to.be.true;
        });

        it('should emit an event', async function () {
            const storedData = await BlockCarInstance.askKyc(expectedTokenId1, { from: user1});
            const event = expectEvent.inLogs(storedData.logs, 'ChangingStatus', {
                status: "KYC asked",
                _address: user1,
                nftId: new BN(expectedTokenId1)
              });
              expect(event.args.timestamp).to.be.bignumber.greaterThan(new BN(1680907093)); //on peut mettre 0, j'ai mis le timestamp au moment du test
        });

        it("should revert beacuse not the owner of the NFT", async () => {  
            await expectRevert(BlockCarInstance.askKyc(expectedTokenId1, { from: user3}), "You not owner");
        }); 

        it("should revert beacuse not the of NFT is over the counter", async () => {  
            await expectRevert(BlockCarInstance.askKyc(expectedTokenId3, { from: user1}), "Id incorrect");
        });

        it("should revert beacuse the KYC is already waiting", async () => {  
            await BlockCarInstance.askKyc(expectedTokenId1, { from: user1});
            await expectRevert(BlockCarInstance.askKyc(expectedTokenId1, { from: user1}), "KYC already waiting");
        });

        it("should revert beacuse the KYC is done", async () => {  
            await BlockCarInstance.askKyc(expectedTokenId1, { from: user1});
            await BlockCarInstance.kycIsApproved(expectedTokenId1, { from: owner});
            await expectRevert(BlockCarInstance.askKyc(expectedTokenId1, { from: user1}), "KYC is done");
        });
    });

    //-------------------- Function kycIsApproved -------------------------//
    describe("testing kycIsApproved", function () {

        beforeEach(async function () {
            BlockCarInstance = await BlockCar.new({from:owner});
            await BlockCarInstance.mintCar(tokenURI, vin, brand, model, color, power, registrationCountry, registrationDate, { from: user1});
            await BlockCarInstance.askKyc(expectedTokenId1, { from: user1});
        });

        it('should have isWaitingKyc to false and isKycDone to true', async function () {
            await BlockCarInstance.kycIsApproved(expectedTokenId1, { from: owner});
            const carInfo = await BlockCarInstance.getCarNft(new BN(expectedTokenId1));
            expect(carInfo.status.isWaitingKyc).to.be.false;
            expect(carInfo.status.isKycDone).to.be.true;
        });

        it('should emit an event', async function () {
            const storedData = await BlockCarInstance.kycIsApproved(expectedTokenId1, { from: owner});
            const event = expectEvent.inLogs(storedData.logs, 'ChangingStatus', {
                status: "KYC done",
                _address: owner,
                nftId: new BN(expectedTokenId1)
              });
              expect(event.args.timestamp).to.be.bignumber.greaterThan(new BN(1680907093)); //on peut mettre 0, j'ai mis le timestamp au moment du test
        });

        it("should revert beacuse not the not approved by the owner of the contract (Ownable.sol)", async () => {  
            await expectRevert(BlockCarInstance.kycIsApproved(expectedTokenId1, { from: user1}), "Ownable: caller is not the owner");
        }); 

        it("should revert beacuse KYC is done", async () => {  
            await BlockCarInstance.kycIsApproved(expectedTokenId1, { from: owner});
            await expectRevert(BlockCarInstance.kycIsApproved(expectedTokenId1, { from: owner}), "KYC done");
        });
    });

    //-------------------- Function carIsForSale -------------------------//
    describe("testing carIsForSale", function () {

        beforeEach(async function () {
            BlockCarInstance = await BlockCar.new({from:owner});
            await BlockCarInstance.mintCar(tokenURI, vin, brand, model, color, power, registrationCountry, registrationDate, { from: user1});
            await BlockCarInstance.askKyc(expectedTokenId1, { from: user1});
            await BlockCarInstance.kycIsApproved(expectedTokenId1, { from: owner});
        });

        it('should have isOnSale to true', async function () {
            await BlockCarInstance.carIsForSale(expectedTokenId1,new BN(155000),new BN(17000), "France", "Strasbourg", "Jean 06 56 89 78 45", { from: user1});
            const carInfo = await BlockCarInstance.getCarNft(new BN(expectedTokenId1));
            expect(carInfo.status.isOnSale).to.be.true;
        });

        it('should emit an event', async function () {
            const storedData = await BlockCarInstance.carIsForSale(expectedTokenId1,new BN(155000),new BN(17000), "France", "Strasbourg", "Jean 06 56 89 78 45", { from: user1});
            const event = expectEvent.inLogs(storedData.logs, 'ChangingStatus', {
                status: "Car for sale",
                _address: user1,
                nftId: new BN(expectedTokenId1)
              });
              expect(event.args.timestamp).to.be.bignumber.greaterThan(new BN(1680907093));
        });

        it("shouldn't get car information because Id incorrect", async () => {  
            await expectRevert(BlockCarInstance.carIsForSale(expectedTokenId3,new BN(155000),new BN(17000), "France", "Strasbourg", "Jean 06 56 89 78 45", { from: user1}),"Id incorrect");
        }); 

        it("should revert beacuse mileage equat to 0", async () => {  
            await expectRevert(BlockCarInstance.carIsForSale(expectedTokenId1,new BN(0),new BN(17000), "France", "Strasbourg", "Jean 06 56 89 78 45", { from: user1}), "Empty");
        }); 

        it("should revert beacuse price equat to 0", async () => {  
            await expectRevert(BlockCarInstance.carIsForSale(expectedTokenId1,new BN(155000),new BN(0), "France", "Strasbourg", "Jean 06 56 89 78 45", { from: user1}), "Empty");
        }); 

        it("should revert beacuse country empty", async () => {  
            await expectRevert(BlockCarInstance.carIsForSale(expectedTokenId1,new BN(155000),new BN(17000), "", "Strasbourg", "Jean 06 56 89 78 45", { from: user1}), "Empty");
        }); 

        it("should revert beacuse localisation empty", async () => {  
            await expectRevert(BlockCarInstance.carIsForSale(expectedTokenId1,new BN(155000),new BN(17000), "France", "", "Jean 06 56 89 78 45", { from: user1}), "Empty");
        }); 

        it("should revert beacuse contact details empty", async () => {  
            await expectRevert(BlockCarInstance.carIsForSale(expectedTokenId1,new BN(155000),new BN(17000), "France", "Strasbourg", "", { from: user1}), "Empty");
        }); 
    });

    //-------------------- Function stopSale -------------------------//
    describe("testing stopSale", function () {

        beforeEach(async function () {
            BlockCarInstance = await BlockCar.new({from:owner});
            await BlockCarInstance.mintCar(tokenURI, vin, brand, model, color, power, registrationCountry, registrationDate, { from: user1});
            await BlockCarInstance.askKyc(expectedTokenId1, { from: user1});
            await BlockCarInstance.kycIsApproved(expectedTokenId1, { from: owner});
            await BlockCarInstance.carIsForSale(expectedTokenId1,new BN(155000),new BN(17000), "France", "Strasbourg", "Jean 06 56 89 78 45", { from: user1});
        });

        it('should have isOnSale to false', async function () {
            await BlockCarInstance.stopSale(expectedTokenId1, { from: user1});
            const carInfo = await BlockCarInstance.getCarNft(new BN(expectedTokenId1));
            expect(carInfo.status.isOnSale).to.be.false;
        });

        it('should emit an event', async function () {
            const storedData = await BlockCarInstance.stopSale(expectedTokenId1, { from: user1});
            const event = expectEvent.inLogs(storedData.logs, 'ChangingStatus', {
                status: "Sale stoped",
                _address: user1,
                nftId: new BN(expectedTokenId1)
              });
              expect(event.args.timestamp).to.be.bignumber.greaterThan(new BN(1680907093));
        });

        it("shouldn't work because Id incorrect", async () => {  
            await expectRevert(BlockCarInstance.stopSale(expectedTokenId3, { from: user1}),"Id incorrect");
        }); 

        it("shouldn't work because not owner or delegator", async () => {  
            await expectRevert(BlockCarInstance.stopSale(expectedTokenId1, { from: user3}),"You not authorized");
        }); 
    });

    //-------------------- Function carIsStolen -------------------------//
    describe("testing carIsStolen", function () {

        beforeEach(async function () {
            BlockCarInstance = await BlockCar.new({from:owner});
            await BlockCarInstance.mintCar(tokenURI, vin, brand, model, color, power, registrationCountry, registrationDate, { from: user1});
            await BlockCarInstance.askKyc(expectedTokenId1, { from: user1});
            await BlockCarInstance.kycIsApproved(expectedTokenId1, { from: owner});
            await BlockCarInstance.carIsForSale(expectedTokenId1,new BN(155000),new BN(17000), "France", "Strasbourg", "Jean 06 56 89 78 45", { from: user1});
        });

        it('should have isOnSale to false and isStolen to true', async function () {
            await BlockCarInstance.carIsStolen(expectedTokenId1, { from: user1});
            const carInfo = await BlockCarInstance.getCarNft(new BN(expectedTokenId1));
            expect(carInfo.status.isOnSale).to.be.false;
            expect(carInfo.status.isStolen).to.be.true;
        });

        it('should emit an event', async function () {
            const storedData = await BlockCarInstance.carIsStolen(expectedTokenId1, { from: user1});
            const event = expectEvent.inLogs(storedData.logs, 'ChangingStatus', {
                status: "Car stolen",
                _address: user1,
                nftId: new BN(expectedTokenId1)
              });
              expect(event.args.timestamp).to.be.bignumber.greaterThan(new BN(1680907093));
        });

        it("shouldn't work because Id incorrect", async () => {  
            await expectRevert(BlockCarInstance.carIsStolen(expectedTokenId3, { from: user1}),"Id incorrect");
        }); 

        it("shouldn't work because not owner or delegator", async () => {  
            await expectRevert(BlockCarInstance.carIsStolen(expectedTokenId1, { from: user3}),"You not authorized");
        }); 
    });

    //-------------------- Function carFound -------------------------//
    describe("testing carFound", function () {

        beforeEach(async function () {
            BlockCarInstance = await BlockCar.new({from:owner});
            await BlockCarInstance.mintCar(tokenURI, vin, brand, model, color, power, registrationCountry, registrationDate, { from: user1});
            await BlockCarInstance.askKyc(expectedTokenId1, { from: user1});
            await BlockCarInstance.kycIsApproved(expectedTokenId1, { from: owner});
            await BlockCarInstance.carIsForSale(expectedTokenId1,new BN(155000),new BN(17000), "France", "Strasbourg", "Jean 06 56 89 78 45", { from: user1});
            await BlockCarInstance.carIsStolen(expectedTokenId1, { from: user1});
        });

        it('should have isOnSale to false and isStolen to true', async function () {
            await BlockCarInstance.carFound(expectedTokenId1, { from: user1});
            const carInfo = await BlockCarInstance.getCarNft(new BN(expectedTokenId1));
            expect(carInfo.status.isStolen).to.be.false;
        });

        it("should emit an event", async function () {
            const storedData = await BlockCarInstance.carFound(expectedTokenId1, { from: user1});
            const event = expectEvent.inLogs(storedData.logs, 'ChangingStatus', {
                status: "Car found",
                _address: user1,
                nftId: new BN(expectedTokenId1)
              });
              expect(event.args.timestamp).to.be.bignumber.greaterThan(new BN(1680907093));
        });

        it("shouldn't work because Id incorrect", async () => {  
            await expectRevert(BlockCarInstance.carFound(expectedTokenId3, { from: user1}),"Id incorrect");
        }); 

        it("shouldn't work because not owner or delegator", async () => {  
            await expectRevert(BlockCarInstance.carFound(expectedTokenId1, { from: user3}),"You not authorized");
        }); 
    });

    //-------------------- Function carIsScrapped -------------------------//
    describe("testing carIsScrapped", function () {

        beforeEach(async function () {
            BlockCarInstance = await BlockCar.new({from:owner});
            await BlockCarInstance.mintCar(tokenURI, vin, brand, model, color, power, registrationCountry, registrationDate, { from: user1});
            await BlockCarInstance.askKyc(expectedTokenId1, { from: user1});
            await BlockCarInstance.kycIsApproved(expectedTokenId1, { from: owner});
        });

        it("should have isOnSale to false and isStolen to true", async function () {
            await BlockCarInstance.carIsScrapped(expectedTokenId1, { from: user1});
            const carInfo = await BlockCarInstance.getCarNft(new BN(expectedTokenId1));
            expect(carInfo.status.isOnSale).to.be.false;
            expect(carInfo.status.isScrapped).to.be.true;
        });

        it("should emit an event", async function () {
            const storedData = await BlockCarInstance.carIsScrapped(expectedTokenId1, { from: user1});
            const event = expectEvent.inLogs(storedData.logs, 'ChangingStatus', {
                status: "Car scrapped",
                _address: user1,
                nftId: new BN(expectedTokenId1)
              });
              expect(event.args.timestamp).to.be.bignumber.greaterThan(new BN(1680907093));
        });

        it("shouldn't work because Id incorrect", async () => {  
            await expectRevert(BlockCarInstance.carIsScrapped(expectedTokenId3, { from: user1}),"Id incorrect");
        }); 

        it("shouldn't work because not owner or delegator", async () => {  
            await expectRevert(BlockCarInstance.carIsScrapped(expectedTokenId1, { from: user3}),"You not authorized");
        }); 
    });

    //-------------------- Function delegeteCar -------------------------//
    describe("testing delegeteCar", function () {

        beforeEach(async function () {
            BlockCarInstance = await BlockCar.new({from:owner});
            await BlockCarInstance.mintCar(tokenURI, vin, brand, model, color, power, registrationCountry, registrationDate, { from: user1});
            await BlockCarInstance.askKyc(expectedTokenId1, { from: user1});
        });

        it("should have isDelegated to true", async function () {
            await BlockCarInstance.kycIsApproved(expectedTokenId1, { from: owner});
            await BlockCarInstance.delegeteCar(user2, expectedTokenId1, { from: user1});
            const carInfo = await BlockCarInstance.getCarNft(new BN(expectedTokenId1));
            expect(carInfo.status.isDelegated).to.be.true;
        });

        it("should do some action after delegation", async function () {
            await BlockCarInstance.kycIsApproved(expectedTokenId1, { from: owner});
            await BlockCarInstance.delegeteCar(user2, expectedTokenId1, { from: user1});
            await BlockCarInstance.carIsForSale(expectedTokenId1,new BN(155000),new BN(17000), "France", "Strasbourg", "Jean 06 56 89 78 45", { from: user2});
            await BlockCarInstance.stopSale(expectedTokenId1, { from: user2});
            await BlockCarInstance.carIsStolen(expectedTokenId1, { from: user2});
            await BlockCarInstance.carFound(expectedTokenId1, { from: user2});
        });

        it("should emit an event", async function () {
            await BlockCarInstance.kycIsApproved(expectedTokenId1, { from: owner});
            const storedData = await BlockCarInstance.delegeteCar(user2, expectedTokenId1, { from: user1});
            const event = expectEvent.inLogs(storedData.logs, 'ChangingStatus', {
                status: "Car delegated",
                _address: user2,
                nftId: new BN(expectedTokenId1)
              });
              expect(event.args.timestamp).to.be.bignumber.greaterThan(new BN(1680907093));
        });

        it("shouldn't work because KYC not approved", async () => {  
            await expectRevert(BlockCarInstance.delegeteCar(user2, expectedTokenId1, { from: user1}),"KYC not approved");
        }); 

        it("shouldn't work because Id incorrect", async () => {  
            await BlockCarInstance.kycIsApproved(expectedTokenId1, { from: owner});
            await expectRevert(BlockCarInstance.delegeteCar(user2, expectedTokenId3, { from: user1}),"Id incorrect");
        }); 

        it("shouldn't work because not owner", async () => {  
            await BlockCarInstance.kycIsApproved(expectedTokenId1, { from: owner});
            await expectRevert(BlockCarInstance.delegeteCar(user2, expectedTokenId1, { from: user3}),"You not owner");
        }); 
    });

    //-------------------- Function stopDelegation -------------------------//
    describe("testing stopDelegation", function () {

        beforeEach(async function () {
            BlockCarInstance = await BlockCar.new({from:owner});
            await BlockCarInstance.mintCar(tokenURI, vin, brand, model, color, power, registrationCountry, registrationDate, { from: user1});
            await BlockCarInstance.askKyc(expectedTokenId1, { from: user1});
            await BlockCarInstance.kycIsApproved(expectedTokenId1, { from: owner});
            await BlockCarInstance.delegeteCar(user2, expectedTokenId1, { from: user1});
        });

        it("should have isDelegated to false", async function () {
            await BlockCarInstance.stopDelegation(expectedTokenId1, { from: user1});
            const carInfo = await BlockCarInstance.getCarNft(new BN(expectedTokenId1));
            expect(carInfo.status.isDelegated).to.be.false;
        });

        it("should not put salling informations to the car", async function () {
            await BlockCarInstance.stopDelegation(expectedTokenId1, { from: user1});
            await expectRevert(BlockCarInstance.carIsForSale(expectedTokenId1,new BN(155000),new BN(17000), "France", "Strasbourg", "Jean 06 56 89 78 45", { from: user2}),"You not authorized");
        });

        it("should emit an event", async function () {
            const storedData = await BlockCarInstance.stopDelegation(expectedTokenId1, { from: user1});
            const event = expectEvent.inLogs(storedData.logs, 'ChangingStatus', {
                status: "Delegation stoped",
                _address: user1,
                nftId: new BN(expectedTokenId1)
              });
              expect(event.args.timestamp).to.be.bignumber.greaterThan(new BN(1680907093));
        });

        it("shouldn't work because not delegated", async () => {  
            await BlockCarInstance.mintCar(tokenURI, vin, brand, model, color, power, registrationCountry, registrationDate, { from: user1});
            await BlockCarInstance.askKyc(expectedTokenId2, { from: user1});
            await BlockCarInstance.kycIsApproved(expectedTokenId2, { from: owner});
            await expectRevert(BlockCarInstance.stopDelegation(expectedTokenId2, { from: user1}),"NFT not delegated");
        }); 

        it("shouldn't work because Id incorrect", async () => {  
            await expectRevert(BlockCarInstance.stopDelegation(expectedTokenId3, { from: user1}),"Id incorrect");
        }); 

        it("shouldn't work because not owner or delegator", async () => {  
            await expectRevert(BlockCarInstance.stopDelegation(expectedTokenId1, { from: user3}),"You not authorized");
        }); 
    });

    //-------------------- Function addDocumentLink -------------------------//
    describe("testing addDocumentLink", function () {

        const linkDocument = "https://gateway.pinata.cloud/ipfs/lgYn521qiACpaaEm4rEX7qWZJmNqGy4mefQZVakoGFSoJp";
        const linkDocumentConcat = linkDocument.concat(";");
        const linkDocumentEmpty = "";

        beforeEach(async function () {
            BlockCarInstance = await BlockCar.new({from:owner});
            await BlockCarInstance.mintCar(tokenURI, vin, brand, model, color, power, registrationCountry, registrationDate, { from: user1});
            await BlockCarInstance.askKyc(expectedTokenId1, { from: user1});
            await BlockCarInstance.kycIsApproved(expectedTokenId1, { from: owner});
        });

        it("should add a link document", async function () {
            await BlockCarInstance.addDocumentLink(linkDocument,expectedTokenId1, { from: user1});
            const carInfo = await BlockCarInstance.getCarNft(new BN(expectedTokenId1));
            expect(carInfo.linkDocument).to.equal(linkDocument);
        });

        it("should not add an empty link", async function () {
            await expectRevert(BlockCarInstance.addDocumentLink(linkDocumentEmpty,expectedTokenId1, { from: user1}),"Empty");
        });

        it("should emit an event", async function () {
            const storedData = await BlockCarInstance.addDocumentLink(linkDocument,expectedTokenId1, { from: user1});
            const event = expectEvent.inLogs(storedData.logs, 'ChangingStatus', {
                status: "Document added",
                _address: user1,
                nftId: new BN(expectedTokenId1)
              });
              expect(event.args.timestamp).to.be.bignumber.greaterThan(new BN(1680907093));
        });

        it("shouldn't work because Id incorrect", async () => {  
            await expectRevert(BlockCarInstance.addDocumentLink(linkDocument, expectedTokenId3, { from: user1}),"Id incorrect");
        }); 

        it("shouldn't work because not owner or delegator", async () => {  
            await expectRevert(BlockCarInstance.addDocumentLink(linkDocument, expectedTokenId1, { from: user3}),"You not authorized");
        }); 
    });

    //-------------------- Function transferFrom -------------------------//
    describe("testing transferFrom", function () {

        beforeEach(async function () {
            BlockCarInstance = await BlockCar.new({from:owner});
            await BlockCarInstance.mintCar(tokenURI, vin, brand, model, color, power, registrationCountry, registrationDate, { from: user1});
            await BlockCarInstance.askKyc(expectedTokenId1, { from: user1});
            await BlockCarInstance.kycIsApproved(expectedTokenId1, { from: owner});
        });

        it("should transfer an NFT from owner to new address and testing status", async function () {
            await BlockCarInstance.transferFrom(user1, user2,expectedTokenId1, { from: user1});
            const carInfo = await BlockCarInstance.getCarNft(new BN(expectedTokenId1));
            expect(carInfo.status.isDelegated).to.be.false;
            expect(carInfo.status.isKycDone).to.be.false;
            expect(carInfo.status.isOnSale).to.be.false;
            const ownerOf = await BlockCarInstance.ownerOf(expectedTokenId1);
            expect(ownerOf).to.equal(user2);
        });

        it("should transfer an NFT from owner to new address by delagator", async function () {
            await BlockCarInstance.delegeteCar(user2, expectedTokenId1, { from: user1});
            await BlockCarInstance.transferFrom(user1, user3,expectedTokenId1, { from: user2});
            const ownerOf = await BlockCarInstance.ownerOf(expectedTokenId1);
            expect(ownerOf).to.equal(user3);
        });

        it("should emit an event", async function () {
            const storedData = await BlockCarInstance.transferFrom(user1, user2,expectedTokenId1, { from: user1});
            const event = expectEvent.inLogs(storedData.logs, 'ChangingStatus', {
                status: "transfer",
                _address: user1,
                nftId: new BN(expectedTokenId1)
              });
              expect(event.args.timestamp).to.be.bignumber.greaterThan(new BN(1680907093));
        });

        
        it("shouldn't transfer an NFT from by random wallet", async function () {
            await expectRevert(BlockCarInstance.transferFrom(user1, user2,expectedTokenId1, { from: user2}),"ERC721: caller is not token owner or approved");
        });

        it("shouldn't work because Id incorrect", async () => {  
            await expectRevert(BlockCarInstance.transferFrom(user1, user2,expectedTokenId3, { from: user1}),"ERC721: invalid token ID");
        }); 
    });

    //-------------------- Function safeTransferFrom -------------------------//
    describe("testing safeTransferFrom", function () {

        beforeEach(async function () {
            BlockCarInstance = await BlockCar.new({from:owner});
            await BlockCarInstance.mintCar(tokenURI, vin, brand, model, color, power, registrationCountry, registrationDate, { from: user1});
            await BlockCarInstance.askKyc(expectedTokenId1, { from: user1});
            await BlockCarInstance.kycIsApproved(expectedTokenId1, { from: owner});
        });

        it("should transfer an NFT from owner to new address and testing status", async function () {
            await BlockCarInstance.safeTransferFrom(user1, user2,expectedTokenId1, { from: user1});
            const carInfo = await BlockCarInstance.getCarNft(new BN(expectedTokenId1));
            expect(carInfo.status.isDelegated).to.be.false;
            expect(carInfo.status.isKycDone).to.be.false;
            expect(carInfo.status.isOnSale).to.be.false;
            const ownerOf = await BlockCarInstance.ownerOf(expectedTokenId1);
            expect(ownerOf).to.equal(user2);
        });

        it("should transfer an NFT from owner to new address by delagator", async function () {
            await BlockCarInstance.delegeteCar(user2, expectedTokenId1, { from: user1});
            await BlockCarInstance.safeTransferFrom(user1, user3,expectedTokenId1, { from: user2});
            const ownerOf = await BlockCarInstance.ownerOf(expectedTokenId1);
            expect(ownerOf).to.equal(user3);
        });

        it("should emit an event", async function () {
            const storedData = await BlockCarInstance.safeTransferFrom(user1, user2,expectedTokenId1, { from: user1});
            const event = expectEvent.inLogs(storedData.logs, 'ChangingStatus', {
                status: "transfer",
                _address: user1,
                nftId: new BN(expectedTokenId1)
              });
              expect(event.args.timestamp).to.be.bignumber.greaterThan(new BN(1680907093));
        });

        
        it("shouldn't transfer an NFT from by random wallet", async function () {
            await expectRevert(BlockCarInstance.safeTransferFrom(user1, user2,expectedTokenId1, { from: user2}),"ERC721: caller is not token owner or approved");
        });

        it("shouldn't work because Id incorrect", async () => {  
            await expectRevert(BlockCarInstance.safeTransferFrom(user1, user2,expectedTokenId3, { from: user1}),"ERC721: invalid token ID");
        }); 
    });

      //-------------------- Function buyNftAndTransferValue -------------------------//
      describe("testing buyNftAndTransferValue", function () {

        beforeEach(async function () {
            BlockCarInstance = await BlockCar.new({from:owner});
            await BlockCarInstance.mintCar(tokenURI, vin, brand, model, color, power, registrationCountry, registrationDate, { from: user1});
            await BlockCarInstance.askKyc(expectedTokenId1, { from: user1});
            await BlockCarInstance.kycIsApproved(expectedTokenId1, { from: owner});
            await BlockCarInstance.carIsForSale(expectedTokenId1,new BN(155000),new BN(17000), "France", "Strasbourg", "Jean 06 56 89 78 45", { from: user1})
        });

        it("should transfer an NFT from owner to new address and testing status", async function () {
            await BlockCarInstance.buyNftAndTransferValue(expectedTokenId1, { from: user2, value:new BN(17000)});
            const carInfo = await BlockCarInstance.getCarNft(new BN(expectedTokenId1));
            expect(carInfo.status.isDelegated).to.be.false;
            expect(carInfo.status.isKycDone).to.be.false;
            expect(carInfo.status.isOnSale).to.be.false;
            const ownerOf = await BlockCarInstance.ownerOf(expectedTokenId1);
            expect(ownerOf).to.equal(user2);
        });

        it("should transfer an NFT from owner to new address by delagator", async function () {
            await BlockCarInstance.delegeteCar(user2, expectedTokenId1, { from: user1});
            await BlockCarInstance.buyNftAndTransferValue(expectedTokenId1, { from: user3, value:new BN(17000)});
            const ownerOf = await BlockCarInstance.ownerOf(expectedTokenId1);
            expect(ownerOf).to.equal(user3);
        });

        it("should emit an event", async function () {
            const storedData = await BlockCarInstance.buyNftAndTransferValue(expectedTokenId1, { from: user2, value:new BN(17000)});
            const event = expectEvent.inLogs(storedData.logs, 'ChangingStatus', {
                status: "transfer with value",
                _address: user2,
                nftId: new BN(expectedTokenId1)
              });
              expect(event.args.timestamp).to.be.bignumber.greaterThan(new BN(1680907093));
        });

        it("shouldn't transfer an NFT, amount not enough", async function () {
            await expectRevert(BlockCarInstance.buyNftAndTransferValue(expectedTokenId1, { from: user2, value:new BN(16999)}),"Amount not good");
        });

        it("shouldn't work because we canceled the sale", async () => {  
            await BlockCarInstance.stopSale(expectedTokenId1, { from: user1});
            await expectRevert(BlockCarInstance.buyNftAndTransferValue(expectedTokenId3, { from: user1, value:new BN(17000)}),"NFT not in sale");
       
        }); 
    });


});