import useEth from '../contexts/EthContext/useEth';
import { useState, useEffect } from 'react';

export function useIsOwner(account) {

  const [isOwner, setIsOwner] = useState(false);
  const { state: { contract,accounts } } = useEth();
  const [owner, setOwner] = useState(accounts[0]);

  useEffect(() => {
  
  if (!account) return
  
  async function fetchData() { 
    setOwner(await contract.methods.owner().call());
    setIsOwner(owner === account);
  }
  fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])
  
  return { isOwner }
  
  }