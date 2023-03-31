import { Button, Flex, FormControl, FormLabel, Heading, Input, Stack, useColorModeValue  } from '@chakra-ui/react';
import React, { useState } from "react";
//import { SmallCloseIcon, Avatar, AvatarBadge, IconButton, Center } from '@chakra-ui/icons';
import useEth from '../contexts/EthContext/useEth';

import { useDisplayNfts } from "../hooks/useDisplayNfts";
import { useIsToto } from "../hooks/useIsToto";
import { useIsOwner } from "../hooks/useIsOwner";

import DisplayNfts from "../components/BlockCar/DisplayNfts";
import DatePicker from "react-datepicker";
import { registerLocale } from  "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import fr from 'date-fns/locale/fr';
registerLocale('fr', fr)


function MyVehicles() {

    const { state: { contract, accounts } } = useEth();
    const [startDate, setStartDate] = useState(new Date());   
    const { test } = useDisplayNfts(accounts);  
    const { toto } = useIsToto(accounts);  
    const { isOwner } = useIsOwner(accounts);
    
    console.log("toto: "+toto);
    console.log("isOwner: "+isOwner);
    //console.log("test depuis MuVéhicles: "+test);
    //console.log("typeof depuis MuVéhicles : "+ typeof(test));


    //const testToString = String(test);
    //console.log("to string : " + testToString);



        /*test.forEach((item) => {
          console.log(item);
        });*/

    
    //test.forEach(element => console.log(element));

    //const [file, setFile] = useState(null); 


    // (async () => { 
    //     const test = await contract.methods.getCarNft(1).call({ from: accounts[0] });
    //     alert(test);
    //   })();




    const handleFileChange = (event) => {
        //setFile(event.target.files[0]);
    };

    const handleSubmit = async () => {

        const selectedDate = startDate;

        const day = selectedDate.getDate();
        const month = String(selectedDate.getMonth() + 1).padStart(2, "0"); // Ajouter un 0 si nécessaire
        const year = selectedDate.getFullYear();
        //console.log(`Jour : ${day}, Mois : ${month}, Année : ${year}`);
        const date = day+month+year;

        const file = document.getElementById('file').value;
        const vinNumber = document.getElementById('vinNumber').value;
        const brand = document.getElementById('brand').value;
        const model = document.getElementById('model').value;
        const color = document.getElementById('color').value;
        const power = document.getElementById('power').value;
        const countryRegistration = document.getElementById('countryRegistration').value;
        //const dateRegistration = document.getElementById('dateRegistration').value;
      
        if (file === '' || vinNumber === '' || brand === '' || model === '' || color === '' || power === '' || countryRegistration === '') {
            alert('Veuillez remplir tous les champs');
        } else {
            await contract.methods.mintCar(file,vinNumber,brand,model,color,power,countryRegistration,date).send({ from: accounts[0] });
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
          <FormLabel fontSize="large">Coleur</FormLabel>
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

    <DisplayNfts />

    </>
    );
}

export default  MyVehicles;