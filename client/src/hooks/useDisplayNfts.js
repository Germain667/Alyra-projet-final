import useEth from '../contexts/EthContext/useEth';
import { useState, useEffect } from 'react';

export function useDisplayNfts(account) {

  const [idNfts, setIdNfts] = useState([]);
  const { state: { contract, accounts } } = useEth();

  useEffect(() => {
  

  if (!account) return
  
  async function fetchData() { 

    //const owner = await contract.methods.owner().call();
    //const test = await contract.methods.getCarNft(1).call({ from: accounts[0] });
    //const test = await contract.methods.getNftIdsByAddress(accounts[0]).call({ from: accounts[0] });
    // console.log("typeof : "+ typeof(test));
    // console.log("useDisplayNft : "+test);

    setIdNfts(await contract.methods.getNftIdsByAddress(accounts[0]).call({ from: accounts[0] }));

    

  }
  fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [account, contract, accounts])
  
  return { 
    idNfts  
  }
  
}