import useEth from '../contexts/EthContext/useEth';
import { useState, useEffect } from 'react';

export function useDisplayNfts4Catalog(account) {

    const [idNfts, setIdNfts] = useState([]);
    const { state: { contract, accounts } } = useEth();

    useEffect(() => {
    
        async function fetchData() { 
            if(contract !== null) {
                //_isOnSale, _isDelegated, _isStolen, _isWaitingKyc, _isKycDone, _isScrapped
                const nftIds = await contract.methods.getNftIdsByOnSaleAndKycDone().call({ from: accounts[0] });
                setIdNfts(nftIds);
            }
        }
        fetchData();
    }, [account, contract, accounts])
    
    return { 
        idNfts  
    }
  
}