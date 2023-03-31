import useEth from '../contexts/EthContext/useEth';
import { useState, useEffect } from 'react';

export function useIsToto(account) {

  const [isOwner, setIsOwner] = useState(false);
  const { state: { contract,accounts } } = useEth();

  useEffect(() => {
  

  if (!account) return
  
  async function fetchData() { 
    const owner = await contract.methods.owner().call();
    setIsOwner(owner === accounts[0]);
  }
  fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])
  
  return { 
    isOwner 
  }
  
}