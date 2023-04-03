import useEth from '../contexts/EthContext/useEth';
import { useState, useEffect } from 'react';

export function useDisplayNfts4Admin(account) {

  const [idNfts, setIdNfts] = useState([]);
  const { state: { contract } } = useEth();

  useEffect(() => {
  

const Ids = [];
  
  async function fetchData() { 

    async function getPastEvent() {
        if (contract) 
        {


            const results = await contract.getPastEvents("Minted", { fromBlock:0 , toBlock: "latest" });
            await Promise.all(results.map(async(mint) => {

                //console.log("mint : "+mint);
                Ids.push(mint.returnValues.nftId);
                //let event = {userAddress:null, tokenURI:null, nftId:null, vin:null, brand:null, model:null, color:null, power:null, registrationCountry:null, registrationDate:null};
                //event.nftId = mint.returnValues.nftId;
                //console.log(event);
                //console.log(Ids);
                
                return Ids;


            }));
            setIdNfts(Ids);
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