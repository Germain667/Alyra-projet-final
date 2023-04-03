import { Heading, Box, Flex, Circle, Image, Badge, Text, Button  } from "@chakra-ui/react";
import { Link } from 'react-router-dom';
//import DisplayNfts from "../components/BlockCar/DisplayNfts";
//import { useDisplayNfts4Admin } from "../hooks/useDisplayNfts4Admin";
import useEth from '../contexts/EthContext/useEth';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';



function Details() {

    const { state: { accounts, contract } } = useEth();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    //const [refresh, setRefresh] = useState(false);
    const id = searchParams.get('id');
    const [nft, setNft] = useState({});
    const [tokenURI, setTokenURI] = useState('');

    useEffect(() => {
        const displayDetails = async () => {
            const nft = await contract.methods.getCarNft(id).call({ from: accounts[0] });
            const _tokenURI = await contract.methods.tokenURI(id).call({ from: accounts[0] });
            setNft(nft);
            setTokenURI(_tokenURI);

            // console.log(id)
            // console.log(nft)
            // console.log(_tokenURI)
        
            //setRefresh(false);
        };
    
        displayDetails();
      }, [contract, accounts, id]);
    


    return (
        <>

            <Heading as="h1" size="xl" textAlign="center" mb={8}>
                Détail du NFT 
            </Heading>

            <Flex alignItems="center" justifyContent="center">
                <Link to="/MyVehicles">
                <Button
                    colorScheme="blue"
                    size="md"
                    variant="outline"
                    fontWeight="medium"
                    _hover={{ bg: 'blue.600', color: 'white' }}
                    >
                    <Text>Retour</Text>
                </Button>
                </Link>
             </Flex>
            <Flex p={20} w="full" alignItems="center" justifyContent="center" flexWrap="wrap">
         {nft.length ? (
                <Box 
                key={nft.vin}
                maxW="sm"
                marginBottom="10px"
                marginLeft="10px"
                marginRight="10px"
                borderWidth="1px"
                rounded="lg"
                shadow="lg"
                position="relative">

                {(!nft.status.isKycDone && !nft.status.isWaitingKyc) && (
                    <Circle
                    size="10px"
                    position="absolute"
                    top={2}
                    right={2}
                    bg="red.500"
                    />
                )}
                {nft.status.isWaitingKyc && (
                    <Circle
                    size="10px"
                    position="absolute"
                    top={2}
                    right={2}
                    bg="orange.500"
                    />
                )}
                {nft.status.isKycDone && (
                    <Circle
                    size="10px"
                    position="absolute"
                    top={2}
                    right={2}
                    bg="green.500"
                    />
                )}
                <Image
                    src={tokenURI}
                    roundedTop="lg"
                />
                <Box p="6">
                    <Box d="flex" alignItems="baseline">
                    
                        <Badge rounded="full" px="2" fontSize="1.5em" colorScheme="blue">
                        {nft.brand} {nft.model}
                        </Badge>
                    
                    </Box>

                    <Flex mt="1" justifyContent="space-between" alignContent="center">
                    <Box
                        fontSize="smaller"
                        fontWeight="semibold"
                        as="h4"
                        lineHeight="tight"
                        isTruncated>
                        Couleur : {nft.color}
                    </Box>
                    </Flex>

                    <Flex mt="1" justifyContent="space-between" alignContent="center">
                    <Box
                        fontSize="smaller"
                        fontWeight="semibold"
                        as="h4"
                        lineHeight="tight"
                        isTruncated>
                        Pays d'immatriculation : {nft.registrationCountry}
                    </Box>
                    </Flex>

                    <Flex mt="1" justifyContent="space-between" alignContent="center">
                    <Box
                        fontSize="smaller"
                        fontWeight="semibold"
                        as="h4"
                        lineHeight="tight"
                        isTruncated>
                        Année d'immatriculation : {nft.registrationDate}
                    </Box>
                    </Flex>
                    <Flex mt="1" justifyContent="space-between" alignContent="center">
                    <Box
                        fontSize="smaller"
                        fontWeight="semibold"
                        as="h4"
                        lineHeight="tight"
                        isTruncated>
                        Puissance : {nft.power} Kw
                    </Box>
                    </Flex>

                    {nft.status.isOneSale && <>(
                    <Flex justifyContent="space-between" alignContent="center">
                    <Box fontSize="2xl" color={('gray.800', 'white')}>
                        <Box as="span" color={'gray.600'} fontSize="lg">
                        Prix : {nft.infosForSale.price} ETH 
                        </Box>
                    </Box>
                    </Flex>
                    )</>}
                    {nft.status.isOneSale && <>(
                    <Flex justifyContent="space-between" alignContent="center">
                    <Box fontSize="2xl" color={('gray.800', 'white')}>
                        <Box as="span" color={'gray.600'} fontSize="lg">
                        Kilométrage : {nft.infosForSale.mileage} Km
                        </Box>
                    </Box>
                    </Flex>
                    )</>}
                </Box>
                
                </Box>
                ) : (
                    <p>En cours de chargement</p>
            )}
                </Flex>

        </>
        );
}

export default  Details;