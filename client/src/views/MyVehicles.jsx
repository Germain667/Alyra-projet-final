import { Button, Flex, FormControl, FormLabel, Heading, Input, Stack, useColorModeValue  } from '@chakra-ui/react';
import React, { useState } from "react";
import useEth from '../contexts/EthContext/useEth';
import axios from 'axios';

import { useDisplayNfts } from "../hooks/useDisplayNfts";
import { useDisplayNfts4Delegator } from "../hooks/useDisplayNfts4Delegator";

import DisplayNfts from "../components/BlockCar/DisplayNfts";
import DatePicker from "react-datepicker";
import { registerLocale } from  "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import fr from 'date-fns/locale/fr';
registerLocale('fr', fr);


function MyVehicles() {

    const { state: { contract, accounts } } = useEth();
    const [startDate, setStartDate] = useState(new Date());   
    const { idNfts } = useDisplayNfts(accounts);  
    const { idNfts4Delegator } = useDisplayNfts4Delegator(accounts);  
    const [file, setFile] = useState();
    //const [fileName, setFileName] = useState("");

    const handleFileChange = (e) => {
      setFile(e.target.files[0]);
      //setFileName(e.target.files[0].name);
    };

    const handleSubmit = async () => {

        const selectedDate = startDate;

        const day = selectedDate.getDate();
        const month = String(selectedDate.getMonth() + 1).padStart(2, "0"); // Ajouter un 0 si nécessaire
        const year = selectedDate.getFullYear();
        const date = day+month+year;

        const fileForm = document.getElementById('file').value;
        const vinNumber = document.getElementById('vinNumber').value;
        const brand = document.getElementById('brand').value;
        const model = document.getElementById('model').value;
        const color = document.getElementById('color').value;
        const power = document.getElementById('power').value;
        const countryRegistration = document.getElementById('countryRegistration').value;
        //const dateRegistration = document.getElementById('dateRegistration').value;
      
        if (fileForm === '' || vinNumber === '' || brand === '' || model === '' || color === '' || power === '' || countryRegistration === '') {
            alert('Veuillez remplir tous les champs');
        } else {

          // const formData = new FormData()
          // formData.append("image", file)
          // formData.append("fileName", fileName)
          // const result = await axios.post('http://localhost:8082/images', formData, { headers: {'Content-Type': 'multipart/form-data'}})
          // const entireURI = result.data.entireURI;
          // await contract.methods.mintCar(entireURI,vinNumber,brand,model,color,power,countryRegistration,date).send({ from: accounts[0] });


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

          await contract.methods.mintCar(entireURI,vinNumber,brand,model,color,power,countryRegistration,date).send({ from: accounts[0] });

          //console.log(response)
          //console.log("entireURI : "+entireURI)

          handleReset();
          alert('Formulaire envoyé');
        }
      };

    function handleReset() {
        document.getElementById('file').value = "";
        document.getElementById('vinNumber').value = "";
        document.getElementById('brand').value = "";
        document.getElementById('model').value = "";
        document.getElementById('color').value = "";
        document.getElementById('power').value = "";
        document.getElementById('countryRegistration').value = "";
        //document.getElementById('dateRegistration').value = "";
    }

  return (
    <>
    <Heading as="h1" size="xl" textAlign="center" mb={8}>
        Mes véhicules
    </Heading>
    <Flex
      minH={'10vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack
        spacing={4}
        w={'full'}
        maxW={'lg'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
          Créer le NFT de votre voiture
        </Heading>

        <FormControl>
            <FormLabel htmlFor="file">Sélectionnez un fichier :</FormLabel>
            <Input type="file" id="file" onChange={handleFileChange} />
        </FormControl>

        <FormControl id="vinNumber" isRequired>
          <FormLabel fontSize="large">Numéro VIN</FormLabel>
          <Input placeholder="Numéro VIN" _placeholder={{ color: 'gray.500' }} type="text" />
        </FormControl>
        <FormControl id="brand" isRequired>
          <FormLabel fontSize="large">Marque</FormLabel>
          <Input placeholder="Marque" _placeholder={{ color: 'gray.500' }} type="text" />
        </FormControl>
        <FormControl id="model" isRequired>
          <FormLabel fontSize="large">Modèle</FormLabel>
          <Input placeholder="Modèle" _placeholder={{ color: 'gray.500' }} type="text" />
        </FormControl>
        <FormControl id="color" isRequired>
          <FormLabel fontSize="large">Couleur</FormLabel>
          <Input placeholder="Modèle" _placeholder={{ color: 'gray.500' }} type="text" />
        </FormControl>
        <FormControl id="power" isRequired>
          <FormLabel fontSize="large">Puissance (en Kw)</FormLabel>
          <Input placeholder="Puissance" _placeholder={{ color: 'gray.500' }} type="text" />
        </FormControl>
        <FormControl id="countryRegistration" isRequired>
          <FormLabel fontSize="large">Pays d'immatriculation</FormLabel>
          <Input placeholder="Pays d'immatriculation" _placeholder={{ color: 'gray.500' }} type="text" />
        </FormControl>


        <FormControl id="dateRegistration" isRequired>
            <FormLabel fontSize="large">Date d'immatriculation</FormLabel>
            <DatePicker locale="fr" selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="dd/MM/yyyy" />
        </FormControl>

        <Stack spacing={6} direction={['column', 'row']}>
          <Button fontSize="initial" bg={'red.400'} color={'white'} w="full" _hover={{ bg: 'red.500',}} onClick={handleReset}>
            Annuler
          </Button>
          <Button fontSize="initial" bg={'blue.400'} color={'white'} w="full" _hover={{ bg: 'blue.500',}} onClick={handleSubmit}>
            Envoyer
          </Button>
        </Stack>
      </Stack>
    </Flex>

    <Heading>
      Mes véhicules
    </Heading>
    <DisplayNfts myData={idNfts} MyPage="MyVehicles" />
    <br />
    <br />
    <br />
    <br />
    <br />
    <Heading>
      Les véhicules qui m'ont été délégués
    </Heading>
    <DisplayNfts myData={idNfts4Delegator} MyPage="MyVehicles" />
    <br />
    <br />
    <br />
    <br />
    <br />
    </>
    );
}

export default  MyVehicles;