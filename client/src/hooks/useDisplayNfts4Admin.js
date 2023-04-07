import useEth from '../contexts/EthContext/useEth';
import { useState, useEffect } from 'react';

export function useDisplayNfts4Admin(account) {

  const [idNfts, setIdNfts] = useState([]);
  //const { state: { contract, web3, txhash } } = useEth();
  const { state: { contract, accounts } } = useEth();

  useEffect(() => {
  

const Ids = [];
  
  async function fetchData() { 

    async function getPastEvent() {
        if (contract) 
        {
            // const deployTx = await web3.eth.getTransaction(txhash);
            // const getCurrentBlock = await web3.eth.getBlockNumber();
            // const results = await contract.getPastEvents("Minted", { fromBlock:deployTx.blockNumber , toBlock: getCurrentBlock });
            // await Promise.all(results.map(async(mint) => {
            //     Ids.push(mint.returnValues.nftId);
            //     return Ids;
            // }));

            //Problème avec les events sur mumbai, j'ai du ajouter ce get dans le smart contract
            const nftIds = await contract.methods.getCurrentId().call({ from: accounts[0] });
            if (nftIds > 1) {
              for(let i=1; i<=nftIds ;i++) {
                Ids.push(i);
              }
              setIdNfts(Ids);
            } else {
              if (nftIds > 0 ) {
                setIdNfts(nftIds);
              }
            }
        }
    }
    getPastEvent();

    //setIdNfts(await contract.methods.getNftIdsByAddress(accounts[0]).call({ from: accounts[0] }));

    

  }
  fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])
  
  return { 
    idNfts  
  }
  
}