import useEth from '../contexts/EthContext/useEth';
import { useState, useEffect } from 'react';

export function useDisplayNfts4Delegator(account) {

  const [idNfts4Delegator, setIdNfts4Delegator] = useState([]);
  const { state: { contract, accounts } } = useEth();

  useEffect(() => {
  

  if (!account) return
  
  async function fetchData() { 
    setIdNfts4Delegator(await contract.methods.getNftIdsByDelegatorAddress(accounts[0]).call({ from: accounts[0] }));

  }
  fetchData();
  }, [account, contract, accounts])
  
  return { 
    idNfts4Delegator  
  }
  
}