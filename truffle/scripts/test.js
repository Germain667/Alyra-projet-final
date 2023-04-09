const BlockCar = artifacts.require("BlockCar");

module.exports = async (callback) => {
  const accounts = await web3.eth.getAccounts();
  const owner = accounts[0];
  const user1 = accounts[1];

  const deployed = await BlockCar.deployed({ from: owner });

  const storedData = await deployed.getCarNft(1, { from: user1 });
  console.log(`NFT value: ${storedData}`);

  const storedData2 = await deployed.getCarNft(2, { from: user1 });
  console.log(`NFT value: ${storedData2}`);

  const storedData3 = await deployed.getCarNft(3, { from: user1 });
  console.log(`NFT value: ${storedData3}`);

   callback();
};
