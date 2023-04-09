import useEth from '../contexts/EthContext/useEth';
import { useState, useEffect } from 'react';

export function useDisplayNfts(account) {

  const [idNfts, setIdNfts] = useState([]);
  const { state: { contract, accounts } } = useEth();

  useEffect(() => {
  

  if (!account) return
  
  async function fetchData() { 

    setIdNfts(await contract.methods.getNftIdsByAddress(accounts[0]).call({ from: accounts[0] }));
  }
  fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [account, contract, accounts])
  
  return { 
    idNfts  
  }
  
}