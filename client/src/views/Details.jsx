import { Box, Container, Stack, Text, Image, Flex, Button, Heading, SimpleGrid, StackDivider, useColorModeValue, List, ListItem, Link,
    AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter } from '@chakra-ui/react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useNavigate , useLocation  } from 'react-router-dom';
import useEth from '../contexts/EthContext/useEth';
import React, { useState, useEffect } from 'react';
import { useDisclosure } from "@chakra-ui/react";
import axios from 'axios';


function Details() {

    const { state: { accounts, contract, txhash, web3 } } = useEth();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [refresh, setRefresh] = useState(false);
    const [isNftOwnerOrDelegator, setNeftStatus] = useState(false);
    const [historique, setHistorique] = useState([]);
    const [nft, setNft] = useState({});
    const [dateFormat, setDate] = useState();
    const [tokenURI, setTokenURI] = useState('');
    const buttonBgColor = useColorModeValue('gray.900', 'gray.50')
    const buttonTextColor = useColorModeValue('white', 'gray.900')
    const id = searchParams.get('id');
    const navigate  = useNavigate();
    const [file, setFile] = useState();
    //const [fileName, setFileName] = useState("");

    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef();


    const { isOpen : isOpen2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure();
    const cancelRef2 = React.useRef();

    const { isOpen : isOpen3, onOpen: onOpen3, onClose: onClose3 } = useDisclosure();
    const cancelRef3 = React.useRef();

    const { isOpen : isOpen4, onOpen: onOpen4, onClose: onClose4 } = useDisclosure();
    const cancelRef4 = React.useRef();

    const { isOpen : isOpen5, onOpen: onOpen5, onClose: onClose5 } = useDisclosure();
    const cancelRef5 = React.useRef();

    const statusTextMap = {
        'KYC asked': 'Le KYC a été demandé',
        'KYC done': 'Le KYC a été éffectué',
        'Car for sale': 'Le véhicule a été mis en vente',
        'Car scrapped': 'Le véhicule a été déclaré épave',
        'Car stolen': 'Le véhicule a été volé',
        'Sale stoped': 'La vente a été annulée',
        'Car found': 'Le véhicule a été retrouvé',
        'Car delegated': 'Le véhicule a été délégué',
        'Document added': 'Un document a été ajouté',
        'Delegation stoped': 'La délégation du véhicule a été annulée',
        'transfer': 'Le véhicule a été cédé',
        'transfer with amount': 'Le véhicule a été transféré avec paiement depuis BlockCar',
      };

    useEffect(() => {
        const displayDetails = async () => {

            const nft = await contract.methods.getCarNft(id).call({ from: accounts[0] });
            const _tokenURI = await contract.methods.tokenURI(id).call({ from: accounts[0] });
            setNft(nft);
            setTokenURI(_tokenURI);


            const registrationDate = nft.registrationDate;
            let day;
            let month;
            let year;
            if (registrationDate.length === 8) {
                day = registrationDate.slice(0, 2);
                month = registrationDate.slice(2, 4);
                year = registrationDate.slice(4, 8);
            } 
            else {
                day = registrationDate.slice(0, 1);
                month = registrationDate.slice(1, 3);
                year = registrationDate.slice(3, 7);
            }
            setDate(day+"/"+month+"/"+year);

            const owner = await contract.methods.ownerOf(id).call();
            const delegtaor = await contract.methods.getApproved(id).call();

            if (owner===accounts[0] || delegtaor===accounts[0]) {
                setNeftStatus(true);
            }
        

            const deployTx = await web3.eth.getTransaction(txhash);
            const getCurrentBlock = await web3.eth.getBlockNumber();
            const filter = {
                filter: { status :"Car for sale", nftId: [id] },
                fromBlock: deployTx.blockNumber,
                toBlock: getCurrentBlock
              };

            const historique = await contract.getPastEvents("ChangingStatus", filter);
            setHistorique(historique);


            setRefresh(false);
        };
    
        displayDetails();
    }, [contract, accounts, id, refresh, txhash, web3]);
    

    const sellNFT = async (id) => {
    //onOpen();
    //console.log("id : "+id)

    const mileage = document.getElementById('mileage').value;
    const price = document.getElementById('price').value;
    const country = document.getElementById('country').value;
    const localisation = document.getElementById('localisation').value;
    const contactDetails = document.getElementById('contactDetails').value;

    //console.log(mileage+ " "+price+ " "+country+ " "+localisation+ " "+contactDetails+ " ");

    if (mileage === '' || price === '' || country === '' || localisation === '' || contactDetails === '') {
        alert('Veuillez remplir tous les champs');
    } else {
        await contract.methods.carIsForSaleAndSetInformationsForSale(id,mileage,price,country,localisation,contactDetails).send({ from: accounts[0] });
        onClose();
        setRefresh(true);
    }
    };

    const carFound = async (id) => {
        await contract.methods.carFound(id).send({ from: accounts[0] });
        setRefresh(true);
    }

    const stopSale = async (id) => {
        await contract.methods.stopSale(id).send({ from: accounts[0] });
        setRefresh(true);
    }

    const stolen = async (id) => {
        await contract.methods.carIsStolen(id).send({ from: accounts[0] });
        setRefresh(true);
    }
    const scrapped = async (id) => {
        await contract.methods.carIsScrapped(id).send({ from: accounts[0] });
        setRefresh(true);
    }
    const delegate = async (id) => {

        const delegatorAddress = document.getElementById('delegatorAddress').value;
    
        if (delegatorAddress === '') {
            alert('Veuillez remplir le champs');
        } else {
            await contract.methods.delegeteCar(delegatorAddress, id).send({ from: accounts[0] });
        }
        onClose2();
        setRefresh(true);
    }

    const cancelDelegate = async (id) => {
        await contract.methods.stopDelegation(id).send({ from: accounts[0] });
        setRefresh(true);
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        //setFileName(e.target.files[0].name);
      };

    const addDocument = async (id) => {

        //const formData = new FormData()
        //formData.append("document", file)
        //formData.append("fileName", fileName)
    
        //console.log("image : ", file);
        //console.log("filename : ", fileName);

        //const result = await axios.post('http://localhost:8082/documents', formData, { headers: {'Content-Type': 'multipart/form-data'}})
        //const entireURI = result.data.entireURI;
        //await contract.methods.addDocumentLink(entireURI, id).send({ from: accounts[0] });


        



        const formData = new FormData();
        formData.append("file", file);

        //console.log('file : '+file);
        //console.log('fileName : '+fileName);

        const url =  "https://api.pinata.cloud/pinning/pinFileToIPFS";
    
        const response = await axios.post(
            url,
            formData,
            {
                maxContentLength: "Infinity",
                headers: {
                    "Content-Type": `multipart/form-data;boundary=${formData._boundary}`, 
                    'pinata_api_key': "f9ba4359e1a9dc8c4a4b",
                    'pinata_secret_api_key': "69fbf7eec316e2cfcc01e4bcbe317fc39882fabab65887e608438de192befb2e"
                }
            }
        )
        const prefixPinata = "https://gateway.pinata.cloud/ipfs/";
        const entireURI = prefixPinata.concat(response.data.IpfsHash);
        await contract.methods.addDocumentLink(entireURI, id).send({ from: accounts[0] });






        onClose5();
        setRefresh(true);
    }

    const safeTransferFrom = async (id) => {

        const transferAddress = document.getElementById('transferAddress').value;
    
        if (transferAddress === '') {
            alert('Veuillez remplir le champs');
        } else {
            await contract.methods.safeTransferFrom(accounts[0],transferAddress, id).send({ from: accounts[0] });
        }
        onClose3();
        setRefresh(true);
    }

    const sellNftAndTransferValueToOwner = async (id) => {

        if (!nft.infosForSale.price) {
            alert('Le prix n\'est pas défini');
        } else {
            await contract.methods.sellNftAndTransferValueToOwner(id).send({
                from: accounts[0],
                value: nft.infosForSale.price*1000000000000000000
              });
        }
        onClose4();
        setRefresh(true);
    }


    return (
        <>

            <Heading as="h1" size="xl" textAlign="center" mb={8}>
                Détail du véhicule 
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
                            {dateFormat}
                            </ListItem>
                        </List>
                        </Box>
                    </Stack>
                    {nft.status.isOnSale &&
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
                            {nft.infosForSale.mileage} Km
                            </ListItem>
                            <ListItem>
                            <Text as={'span'} fontWeight={'bold'}>
                                Prix : 
                            </Text>{' '}
                            {nft.infosForSale.price} ETH
                            </ListItem>
                            <ListItem>
                            <Text as={'span'} fontWeight={'bold'}>
                                Pays :
                            </Text>{' '}
                            {nft.infosForSale.country}
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
                    }

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
                            Historique des actions
                        </Text>

                        <List spacing={2}>
                            <List>
                            {historique.length &&
                            historique.map((event, index) => {
                                var date = new Date(event.returnValues.timestamp*1000); 
                                // Obtenir les éléments de date et d'heure individuellement
                                var year = date.getFullYear();
                                var month = date.getMonth() + 1;
                                var day = date.getDate();
                                var hours = date.getHours();
                                var minutes = date.getMinutes();
                                var seconds = date.getSeconds();

                                // Formater la date et l'heure comme vous le souhaitez
                                var formattedDateTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
                                return (
                                <React.Fragment key={index}>
                                    <ListItem>
                                        <Text as={'span'} fontWeight={'bold'}>Status : </Text>{statusTextMap[event.returnValues.status]} {' '}
                                        <Text as={'span'} fontWeight={'bold'}>Date : </Text>{formattedDateTime} {' '} 
                                    </ListItem>
                                </React.Fragment>
                                );
                            })}
                            </List>
                        </List>
                        </Box>
                    </Stack>

                    {nft.linkDocument.length &&
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
                            Document concernant le véhicule
                        </Text>

                        <List spacing={2}>

                        {nft.linkDocument.split(';').map((link, index) => (
                            <ListItem key={index}>
                                <Text as={'span'} fontWeight={'bold'}>
                                    Lien {index + 1}: 
                                </Text>{' '}
                                <Link href={link} isExternal color="teal.500">{link}</Link>
                            </ListItem>
                        ))}

       
                        </List>
                        </Box>
                    </Stack>
                    }


                    {(!nft.status.isOnSale && !nft.status.isScrapped && !nft.status.isStolen && isNftOwnerOrDelegator) &&
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
                        onClick={onOpen}
                        >
                        Mettre en vente
                    </Button>
                    }
                    {(!nft.status.isStolen && !nft.status.isScrapped && isNftOwnerOrDelegator) &&
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
                        onClick={onOpen3}
                        >
                        Céder le véhicule
                    </Button>
                    }
                    {(nft.status.isOnSale && !nft.status.isStolen && !nft.status.isScrapped && isNftOwnerOrDelegator) &&
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
                        onClick={() => stopSale(id)}
                        >
                        Annuler la vente
                    </Button>
                    }
                    {(!nft.status.isScrapped && isNftOwnerOrDelegator) &&
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
                        onClick={onOpen5}
                        >
                        Ajouter un document
                    </Button>
                    }
                    {(nft.status.isStolen && !nft.status.isScrapped && isNftOwnerOrDelegator) &&
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
                        onClick={() => carFound(id)}
                        >
                        Le véhicule volé a été retrouvé
                    </Button>
                    }
                    {(isNftOwnerOrDelegator && !nft.status.isStolen && !nft.status.isScrapped) &&
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
                        onClick={() => stolen(id)}
                        >
                        Déclarer le vol du véhicule
                    </Button>
                    }
                    {(isNftOwnerOrDelegator && !nft.status.isScrapped) &&
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
                        onClick={() => scrapped(id)}
                        >
                        Le véhicule est épave
                    </Button>
                    }
                    {(isNftOwnerOrDelegator && !nft.status.isStolen && !nft.status.isDelegated  && !nft.status.isScrapped) &&
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
                        onClick={onOpen2}
                        >
                        Déléguer le véhicule
                    </Button>
                    }
                    {(nft.status.isDelegated && !nft.status.isScrapped && !nft.status.isStolen && isNftOwnerOrDelegator) &&
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
                        onClick={() => cancelDelegate(id)}
                        >
                        Annuler la délégation
                    </Button>
                    }
                    {(nft.status.isOnSale && !nft.status.isScrapped && !nft.status.isStolen && !isNftOwnerOrDelegator) &&
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
                        onClick={onOpen4}
                        >
                        Acheter ce véhicule
                    </Button>
                    }
                    </Stack>
                </SimpleGrid>
            </Container>
                       : <p>No NFTs available</p>}

            <AlertDialog
            motionPreset='slideInBottom'
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isOpen={isOpen}
            isCentered
            size="4xl"
            >
            <AlertDialogOverlay />
            <AlertDialogContent bg="white" color="black" borderRadius="md">
                <AlertDialogHeader bg="blue.300" color="white" borderTopRadius="md" px={4} py={2}>
                <Text fontSize="xl" fontWeight="bold">Informations pour la mise en vente :</Text>
                </AlertDialogHeader>
                <AlertDialogCloseButton />
                <AlertDialogBody>
                <FormControl id="mileage" isRequired>
                    <FormLabel fontSize="large">Kilométrage</FormLabel>
                    <Input placeholder="Kilométrage" _placeholder={{ color: 'black.100' }} type="text" />
                </FormControl>
                <FormControl id="price" isRequired>
                    <FormLabel fontSize="large">Prix</FormLabel>
                    <Input placeholder="Prix" _placeholder={{ color: 'black.100' }} type="text" />
                </FormControl>
                <FormControl id="country" isRequired>
                    <FormLabel fontSize="large">Pays</FormLabel>
                    <Input placeholder="Pays" _placeholder={{ color: 'black.100' }} type="text" />
                </FormControl>
                <FormControl id="localisation" isRequired>
                    <FormLabel fontSize="large">Localisation</FormLabel>
                    <Input placeholder="Localisation" _placeholder={{ color: 'black.100' }} type="text" />
                </FormControl>
                <FormControl id="contactDetails" isRequired>
                    <FormLabel fontSize="large">Informations de contact</FormLabel>
                    <Input placeholder="Informations de contact" _placeholder={{ color: 'black.100' }} type="text" />
                </FormControl>
                </AlertDialogBody>
                <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose} colorScheme="red" mr={3}>
                    Annuler
                </Button>
                <Button colorScheme="blue" onClick={() => sellNFT(id)}>
                    Envoyer
                </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>



            <AlertDialog
            motionPreset='slideInBottom'
            leastDestructiveRef={cancelRef2}
            onClose={onClose2}
            isOpen={isOpen2}
            isCentered
            size="4xl"
            >
            <AlertDialogOverlay />
            <AlertDialogContent bg="white" color="black" borderRadius="md">
                <AlertDialogHeader bg="blue.300" color="white" borderTopRadius="md" px={4} py={2}>
                <Text fontSize="xl" fontWeight="bold">A qui souhaitez vous déléguer votre véhicule ? :</Text>
                </AlertDialogHeader>
                <AlertDialogCloseButton />
                <AlertDialogBody>
                <FormControl id="delegatorAddress" isRequired>
                    <FormLabel fontSize="large">Adresse de déléguation</FormLabel>
                    <Input placeholder="Adresse de déléguation" _placeholder={{ color: 'black.100' }} type="text" />
                </FormControl>
                </AlertDialogBody>
                <AlertDialogFooter>
                <Button ref={cancelRef2} onClick={onClose2} colorScheme="red" mr={3}>
                    Annuler
                </Button>
                <Button colorScheme="blue" onClick={() => delegate(id)}>
                    Envoyer
                </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>



            <AlertDialog
            motionPreset='slideInBottom'
            leastDestructiveRef={cancelRef3}
            onClose={onClose3}
            isOpen={isOpen3}
            isCentered
            size="4xl"
            >
            <AlertDialogOverlay />
            <AlertDialogContent bg="white" color="black" borderRadius="md">
                <AlertDialogHeader bg="blue.300" color="white" borderTopRadius="md" px={4} py={2}>
                <Text fontSize="xl" fontWeight="bold">A qui souhaitez vous céder votre véhicule ? :</Text>
                </AlertDialogHeader>
                <AlertDialogCloseButton />
                <AlertDialogBody>
                <FormControl id="transferAddress" isRequired>
                    <FormLabel fontSize="large">Adresse de transfert</FormLabel>
                    <Input placeholder="Adresse de trasnfert" _placeholder={{ color: 'black.100' }} type="text" />
                </FormControl>
                </AlertDialogBody>
                <AlertDialogFooter>
                <Button ref={cancelRef3} onClick={onClose3} colorScheme="red" mr={3}>
                    Annuler
                </Button>
                <Button colorScheme="blue" onClick={() => safeTransferFrom(id)}>
                    Envoyer
                </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>


            <AlertDialog
            motionPreset='slideInBottom'
            leastDestructiveRef={cancelRef4}
            onClose={onClose4}
            isOpen={isOpen4}
            isCentered
            size="4xl"
            >
            <AlertDialogOverlay />
            <AlertDialogContent bg="white" color="black" borderRadius="md">
                <AlertDialogHeader bg="blue.300" color="white" borderTopRadius="md" px={4} py={2}>
                <Text fontSize="xl" fontWeight="bold">Souhaitez vous acheter ce véhicule ? :</Text>
                </AlertDialogHeader>
                <AlertDialogCloseButton />
                <AlertDialogBody>

                </AlertDialogBody>
                <AlertDialogFooter>
                <Button ref={cancelRef4} onClick={onClose4} colorScheme="red" mr={3}>
                    Non
                </Button>
                <Button colorScheme="blue" onClick={() => sellNftAndTransferValueToOwner(id)}>
                    Oui
                </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>


            <AlertDialog
            motionPreset='slideInBottom'
            leastDestructiveRef={cancelRef4}
            onClose={onClose5}
            isOpen={isOpen5}
            isCentered
            size="4xl"
            >
            <AlertDialogOverlay />
            <AlertDialogContent bg="white" color="black" borderRadius="md">
                <AlertDialogHeader bg="blue.300" color="white" borderTopRadius="md" px={4} py={2}>
                <Text fontSize="xl" fontWeight="bold">Souhaitez vous ajouter un document ? :</Text>
                </AlertDialogHeader>
                <AlertDialogCloseButton />
                <AlertDialogBody>
                <FormControl>
                    <FormLabel htmlFor="file">Sélectionnez un fichier :</FormLabel>
                    <Input type="file" id="file" onChange={handleFileChange} />
                </FormControl>
                </AlertDialogBody>
                <AlertDialogFooter>
                <Button ref={cancelRef5} onClick={onClose5} colorScheme="red" mr={3}>
                    Non
                </Button>
                <Button colorScheme="blue" onClick={() => addDocument(id)}>
                    Oui
                </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>

            <br /><br /><br />
        </>
        );
}

export default  Details;