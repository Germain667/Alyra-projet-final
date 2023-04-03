import { Heading } from "@chakra-ui/react";
import DisplayNfts from "../components/BlockCar/DisplayNfts";
import { useDisplayNfts4Admin } from "../hooks/useDisplayNfts4Admin";
import useEth from '../contexts/EthContext/useEth';

function Admin() {

    const { state: { accounts } } = useEth();
    const { idNfts } = useDisplayNfts4Admin(accounts);  


    return (
            <>
                <Heading as="h1" size="xl" textAlign="center" mb={8}>
                    Administration
                </Heading>
                <DisplayNfts myData={idNfts} MyPage="Admin" />
            </>
        );
}

export default  Admin;