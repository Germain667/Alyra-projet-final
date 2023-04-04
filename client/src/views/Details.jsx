import { Box, Container, Stack, Text, Image, Flex, Button, Heading, SimpleGrid, StackDivider, useColorModeValue, List, ListItem,
  } from '@chakra-ui/react';
import { useNavigate , useLocation  } from 'react-router-dom';
//import DisplayNfts from "../components/BlockCar/DisplayNfts";
//import { useDisplayNfts4Admin } from "../hooks/useDisplayNfts4Admin";
import useEth from '../contexts/EthContext/useEth';
import { useState, useEffect } from 'react';



function Details() {

    const { state: { accounts, contract } } = useEth();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [refresh, setRefresh] = useState(false);
    const [isNftOwnerOrDelegator, setNeftStatus] = useState(false);
    const [nft, setNft] = useState({});
    const [tokenURI, setTokenURI] = useState('');
    const buttonBgColor = useColorModeValue('gray.900', 'gray.50')
    const buttonTextColor = useColorModeValue('white', 'gray.900')
    const id = searchParams.get('id');
    const navigate  = useNavigate();

    useEffect(() => {
        const displayDetails = async () => {
            const nft = await contract.methods.getCarNft(id).call({ from: accounts[0] });
            const _tokenURI = await contract.methods.tokenURI(id).call({ from: accounts[0] });
            setNft(nft);
            setTokenURI(_tokenURI);

            console.log(id)
            console.log(nft)
            console.log(_tokenURI)

            const owner = await contract.methods.ownerOf(id).call();
            const delegtaor = await contract.methods.getApproved(id).call();

            console.log("owner"+owner);
            console.log("delegtaor"+delegtaor);
            console.log("accounts[0]"+accounts[0]);

            if (owner===accounts[0] || delegtaor===accounts[0]) {
                setNeftStatus(true);
            }
        
            setRefresh(false);
        };
    
        displayDetails();
      }, [contract, accounts, id, refresh]);
    

      const sellNFT = async (id) => {
        console.log("id : "+id)
        await contract.methods.carIsForSaleAndSetInformationsForSale(id,"50","5","1564654","germain 06 30 97 83 62").send({ from: accounts[0] });
        setRefresh(true);
      };

    return (
        <>

            <Heading as="h1" size="xl" textAlign="center" mb={8}>
                Détail du NFT 
            </Heading>
        
            <Flex alignItems="center" justifyContent="center">

                <Button
                    colorScheme="blue"
                    size="md"
                    variant="outline"
                    fontWeight="medium"
                    _hover={{ bg: 'blue.600', color: 'white' }}
                    onClick={() => navigate(-1)}
                    >
                    <Text>Retour</Text>
                </Button>
             </Flex>
             {nft.length ? 
             <Container maxW={'7xl'}>
                <SimpleGrid
                    columns={{ base: 1, lg: 2 }}
                    spacing={{ base: 8, md: 10 }}
                    py={{ base: 18, md: 24 }}>
                    <Flex>
                    <Image
                        rounded={'md'}
                        alt={'product image'}
                        src={tokenURI}
                        fit={'cover'}
                        align={'center'}
                        w={'100%'}
                        h={{ base: '100%', sm: '300px', lg: '200px' }}
                    />
                    </Flex>
                    <Stack spacing={{ base: 6, md: 10 }}>
                    <Box as={'header'}>
                        <Heading
                        lineHeight={1.1}
                        fontWeight={600}
                        fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}>
                        {nft.brand} {nft.model}
                        </Heading>
                        <Text
                        color={('gray.900', 'gray.400')}
                        fontWeight={300}
                        fontSize={'2xl'}>


                        {nft.status.isOnSale ? `${nft.infosForSale.price} ETH` : "Cette voiture n'est pas en vente"}



                        </Text>
                    </Box>

                    
                    <Stack
                        spacing={{ base: 4, sm: 6 }}
                        direction={'column'}
                        divider={
                        <StackDivider
                            borderColor={('gray.200', 'gray.600')}
                        />
                        }>

                        <Box>
                        <Text
                            fontSize={{ base: '16px', lg: '18px' }}
                            color={('yellow.500', 'yellow.300')}
                            fontWeight={'500'}
                            textTransform={'uppercase'}
                            mb={'4'}>
                            Informations concernant la voiture
                        </Text>

                        <List 
                        spacing={2}>
                            <ListItem>
                            <Text as={'span'} fontWeight={'bold'}>
                                Numéro VIN :
                            </Text>{' '}
                            {nft.vin}
                            </ListItem>
                            <ListItem>
                            <Text as={'span'} fontWeight={'bold'}>
                                Marque : 
                            </Text>{' '}
                            {nft.brand}
                            </ListItem>
                            <ListItem>
                            <Text as={'span'} fontWeight={'bold'}>
                                Modèle :
                            </Text>{' '}
                            {nft.model}
                            </ListItem>
                            <ListItem>
                            <Text as={'span'} fontWeight={'bold'}>
                                Couleur :
                            </Text>{' '}
                            {nft.color}
                            </ListItem>
                            <ListItem>
                            <Text as={'span'} fontWeight={'bold'}>
                                Puissance :
                            </Text>{' '}
                            {nft.power} Kw
                            </ListItem>
                            <ListItem>
                            <Text as={'span'} fontWeight={'bold'}>
                                Pays d'immatriculation :
                            </Text>{' '}
                            {nft.registrationCountry}
                            </ListItem>
                            <ListItem>
                            <Text as={'span'} fontWeight={'bold'}>
                                Date d'immatriculation :
                            </Text>{' '}
                            {nft.registrationDate}
                            </ListItem>
                        </List>
                        </Box>
                    </Stack>

                    <Stack
                        spacing={{ base: 4, sm: 6 }}
                        direction={'column'}
                        divider={
                        <StackDivider
                            borderColor={('gray.200', 'gray.600')}
                        />
                        }>

                        <Box>
                        <Text
                            fontSize={{ base: '16px', lg: '18px' }}
                            color={('yellow.500', 'yellow.300')}
                            fontWeight={'500'}
                            textTransform={'uppercase'}
                            mb={'4'}>
                            Informations concernant la vente
                        </Text>

                        <List 
                        spacing={2}>
                            <ListItem>
                            <Text as={'span'} fontWeight={'bold'}>
                                Kilométrage :
                            </Text>{' '}
                            {nft.infosForSale.mileage}
                            </ListItem>
                            <ListItem>
                            <Text as={'span'} fontWeight={'bold'}>
                                Prix : 
                            </Text>{' '}
                            {nft.infosForSale.price}
                            </ListItem>
                            <ListItem>
                            <Text as={'span'} fontWeight={'bold'}>
                                Localisation :
                            </Text>{' '}
                            {nft.infosForSale.localisation}
                            </ListItem>
                            <ListItem>
                            <Text as={'span'} fontWeight={'bold'}>
                                Contact :
                            </Text>{' '}
                            {nft.infosForSale.contactDetails}
                            </ListItem>
                        </List>
                        </Box>
                    </Stack>
                    

                    {(!nft.status.isOnSale && isNftOwnerOrDelegator) &&
                    <Button
                        rounded={'none'}
                        w={'full'}
                        mt={8}
                        size={'lg'}
                        py={'7'}
                        bg={buttonBgColor}
                        color={buttonTextColor}
                        textTransform={'uppercase'}
                        _hover={{
                        transform: 'translateY(2px)',
                        boxShadow: 'lg',
                        }}
                        onClick={() => sellNFT(id)}
                        >
                        Mettre en vente
                    </Button>
                    }





                    </Stack>
                </SimpleGrid>
                </Container>
                       : <p>No NFTs available</p>}
                  

        </>
        );
}

export default  Details;