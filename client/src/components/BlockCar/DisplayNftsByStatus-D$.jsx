import useEth from "../../contexts/EthContext/useEth";
import React, { useState, useEffect } from "react";
import { useIsOwner } from "../../hooks/useIsOwner";

import {Flex, Circle, Box, Image, Badge, Button} from '@chakra-ui/react';
//import {Icon, chakra, Tooltip } from '@chakra-ui/react';
//import { FiShoppingCart } from 'react-icons/fi';


function DisplayNftsByStatus(props) {
  const { state: { contract, accounts } } = useEth();
  const { myData } = props;
  const [nfts, setNfts] = useState([]);
  const { isOwner } = useIsOwner(accounts);
  const [refresh, setRefresh] = useState(false);


  useEffect(() => {
    const fetchNfts = async () => {
      const nfts = [];

      for (const id of myData) {
        const _tokenURI = await contract.methods.tokenURI(id).call({ from: accounts[0] });

        //console.log("_tokenURI : "+_tokenURI);

        // fetch(_tokenURI)
        // .then(response => response.json())
        // .then(data => console.log(data))
        // .catch(error => console.error(error))


        const mergeObject = { ...nft, _tokenURI, id };
        nfts.push({ mergeObject });
        //console.log(mergeObject);
      }

      setRefresh(false);
      setNfts(nfts);
    };

    fetchNfts();
  }, [contract, accounts, myData, refresh]);


  const askKyc = async (id) => {
    console.log("id : "+id);
    await contract.methods.askKyc(id).send({ from: accounts[0] });
    setRefresh(true);
  };

  const kycIsApproved = async (id) => {
    console.log("id : "+id);
    await contract.methods.kycIsApproved(id).send({ from: accounts[0] });
    setRefresh(true);

  };

  return (
    <Flex p={50} w="full" alignItems="center" justifyContent="center" flexWrap="wrap">
      {nfts.length ? nfts.map((data) => (
    <Box 
      //onClick={() => console.log(data)}
      //bg={useColorModeValue('white', 'gray.800')}
      key={data.mergeObject.vin}
      maxW="sm"
      marginBottom="10px"
      marginLeft="10px"
      marginRight="10px"
      borderWidth="1px"
      rounded="lg"
      shadow="lg"
      position="relative">

      {(!data.mergeObject.status.isKycDone && !data.mergeObject.status.isWaitingKyc) && (
        <Circle
          size="10px"
          position="absolute"
          top={2}
          right={2}
          bg="red.500"
        />
      )}
      {data.mergeObject.status.isWaitingKyc && (
        <Circle
          size="10px"
          position="absolute"
          top={2}
          right={2}
          bg="orange.500"
        />
      )}
      {data.mergeObject.status.isKycDone && (
        <Circle
          size="10px"
          position="absolute"
          top={2}
          right={2}
          bg="green.500"
        />
      )}
      <Image
        src={data.mergeObject._tokenURI}
        //src="http://localhost:8082/images/04ba5a200c3870213403b5da88b49c69"
        alt={`Picture of ${data.name}`}
        roundedTop="lg"
      />
      <Box p="6">
        <Box d="flex" alignItems="baseline">
          
            <Badge rounded="full" px="2" fontSize="1.5em" colorScheme="blue">
              {data.mergeObject.brand} {data.mergeObject.model}
            </Badge>
          
        </Box>

        <Flex mt="1" justifyContent="space-between" alignContent="center">
          <Box
            fontSize="smaller"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            isTruncated>
            Couleur : {data.mergeObject.color}
          </Box>
        </Flex>

        <Flex mt="1" justifyContent="space-between" alignContent="center">
          <Box
            fontSize="smaller"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            isTruncated>
            Pays d'immatriculation : {data.mergeObject.registrationCountry}
          </Box>
        </Flex>

        <Flex mt="1" justifyContent="space-between" alignContent="center">
          <Box
            fontSize="smaller"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            isTruncated>
            Année d'immatriculation : {data.mergeObject.registrationDate}
          </Box>
        </Flex>
        <Flex mt="1" justifyContent="space-between" alignContent="center">
          <Box
            fontSize="smaller"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            isTruncated>
            Puissance : {data.mergeObject.power} Kw
          </Box>
        </Flex>

        {data.mergeObject.status.isOneSale && <>(
        <Flex justifyContent="space-between" alignContent="center">
          <Box fontSize="2xl" color={('gray.800', 'white')}>
            <Box as="span" color={'gray.600'} fontSize="lg">
             Prix : {data.mergeObject.infosForSale.price} ETH 
            </Box>
          </Box>
        </Flex>
        )</>}
        {data.mergeObject.status.isOneSale && <>(
        <Flex justifyContent="space-between" alignContent="center">
          <Box fontSize="2xl" color={('gray.800', 'white')}>
            <Box as="span" color={'gray.600'} fontSize="lg">
            Kilométrage : {data.mergeObject.infosForSale.mileage} Km
            </Box>
          </Box>
        </Flex>
        )</>}
      </Box>
      {(!isOwner && !data.mergeObject.status.isKycDone && !data.mergeObject.status.isWaitingKyc) && <Button size="lg" onClick={() => askKyc(data.mergeObject.id)} colorScheme='blue'>Demander le Kyc</Button>}
      {(isOwner && data.mergeObject.status.isWaitingKyc)&& <Button size="lg" onClick={() => kycIsApproved(data.mergeObject.id)} colorScheme='orange'>Valider le Kyc</Button>}
    </Box>

      )) : <p>No NFTs available</p>}
    </Flex>
  );
}

export default DisplayNftsByStatus;
