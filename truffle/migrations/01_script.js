const BlockCar = artifacts.require("BlockCar");

module.exports = async (deployer, network, accounts) => {
   await deployer.deploy(BlockCar,  {from: accounts[0]});
   const owner = accounts[0];
   const user1 = accounts[1];
   const user2 = accounts[2];
   const user3 = accounts[3];
   const BlockCarInstance = await BlockCar.deployed();

   const tokenURI1 = "https://gateway.pinata.cloud/ipfs/QmWLcYwoXP6Ce3gL8xZ647DjnYB2wDaeAV7uoRNBwLHHgS";
   const vin1 = "123456789azerty67";
   const brand1 = "Toyota";
   const model1 = "Corolla";
   const color1 = "noir";
   const power1 = "120";
   const registrationCountry1 = "Allemagne";
   const registrationDate1 = "05082019";
   const expectedTokenId1 = 1;
   const mileage1 = 155000;
   const Price1 = 17000000;
   const country1 = "France";
   const location1 = "Strasbourg";
   const contact1 = "Jean 06 56 89 78 45";

   await BlockCarInstance.mintCar(tokenURI1, vin1, brand1, model1, color1, power1, registrationCountry1, registrationDate1, { from: user1 });
   await BlockCarInstance.askKyc(expectedTokenId1, { from: user1 });
   await BlockCarInstance.kycIsApproved(expectedTokenId1, { from: owner });
   await BlockCarInstance.carIsForSale(expectedTokenId1, mileage1, Price1, country1, location1, contact1, { from: user1 });

   const tokenURI2 = "https://gateway.pinata.cloud/ipfs/QmQG83AQ2m1FiWprwvmdH3yRWyN9rRLRhTsJfZFJryvbRm";
   const vin2 = "987654321ytreza76";
   const brand2 = "Toyota";
   const model2 = "Yaris";
   const color2 = "noir";
   const power2 = "100";
   const registrationCountry2 = "Espagne";
   const registrationDate2 = "21042021";
   const expectedTokenId2 = 2;
   const mileage2 = 115000;
   const Price2 = 18550000;
   const country2 = "Espagne";
   const location2 = "Madrid, calle 13";
   const contact2 = "Juan 06 56 89 78 45";

   await BlockCarInstance.mintCar(tokenURI2, vin2, brand2, model2, color2, power2, registrationCountry2, registrationDate2, { from: user1 });
   await BlockCarInstance.askKyc(expectedTokenId2, { from: user1 });
   await BlockCarInstance.kycIsApproved(expectedTokenId2, { from: owner });
   await BlockCarInstance.carIsForSale(expectedTokenId2, mileage2, Price2, country2, location2, contact2, { from: user1 });

   const tokenURI3 = "https://gateway.pinata.cloud/ipfs/QmWn234qiACpaaEm4rEX7qWZJmNqGy4mefQZVaSBZkSsWe";
   const vin3 = "987654331ytreza76";
   const brand3 = "Fiat";
   const model3 = "500";
   const color3 = "rouge";
   const power3 = "150";
   const registrationCountry3 = "Italie";
   const registrationDate3 = "21042016";
   const expectedTokenId3 = 3;
   const mileage3 = 185600;
   const Price3 = 15420000;
   const country3 = "Italie";
   const location3 = "Rome";
   const contact3 = "Felipe 65 56 89 21 64";

   await BlockCarInstance.mintCar(tokenURI3, vin3, brand3, model3, color3, power3, registrationCountry3, registrationDate3, { from: user2 });
   await BlockCarInstance.askKyc(expectedTokenId3, { from: user2 });
   await BlockCarInstance.kycIsApproved(expectedTokenId3, { from: owner });
   await BlockCarInstance.carIsForSale(expectedTokenId3, mileage3, Price3, country3, location3, contact3, { from: user2 });
};

// const BlockCar = artifacts.require("BlockCar");

// module.exports =  (deployer) => {
//    deployer.deploy(BlockCar);
// };