import { Heading } from "@chakra-ui/react";
import DisplayNfts from "../components/BlockCar/DisplayNfts";
import { useDisplayNfts4Catalog } from "../hooks/useDisplayNfts4Catalog";
import useEth from '../contexts/EthContext/useEth';

function Catalog() {

    const { state: { accounts } } = useEth();
    const { idNfts } = useDisplayNfts4Catalog(accounts);  

    //console.log(idNfts)

  return (
    <>
            
        <Heading as="h1" size="xl" textAlign="center" mb={8}>
            Catalogue
        </Heading>
        <DisplayNfts myData={idNfts} MyPage="Catalog" />
            
    </>
    );
}

export default  Catalog;