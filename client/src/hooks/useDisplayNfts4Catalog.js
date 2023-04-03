import useEth from '../contexts/EthContext/useEth';
import { useState, useEffect } from 'react';

export function useDisplayNfts4Catalog(account) {

    const [idNfts, setIdNfts] = useState([]);
    const { state: { contract, accounts } } = useEth();

    useEffect(() => {
    
        async function fetchData() { 
            if(contract !== null) {
                //_isOnSale, _isDelegated, _isStolen, _isWaitingKyc, _isKycDone, _isScrapped
                const nftIds = await contract.methods.getNftIdsByStatus(false,false,false,true,true,false).call({ from: accounts[0] });
                setIdNfts(nftIds);
                //console.log("idNfts : ",nftIds);
            }
        }
        fetchData();
    }, [account, contract, accounts])
    
    return { 
        idNfts  
    }
  
}