import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { EthProvider } from "./contexts/EthContext";
import BlockCar from "./components/BlockCar";
import { ChakraProvider } from '@chakra-ui/react'
import "./styles.css";
import Address from "./components/BlockCar/Address";
import Home from "./views/Home";
import MyVehicles from "./views/MyVehicles";
import Catalog from "./views/Catalog";
import Admin from "./views/Admin";
import HeaderMenu from "./components/BlockCar/HeaderMenu";
import { Box, Heading, Link, Text, Icon, Flex, Image } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(

  <React.StrictMode>
    <Router>
      <ChakraProvider>
        <EthProvider>

          <Box bg="gray.700" boxShadow="md">
            <Flex justify="space-between" align="center" p={4}>  
              <Heading as="h1" size="lg" color="White" ml={4}>
                <Image src="./logo.png" alt="logo" width="250px" mr={2} />
              </Heading>
                <HeaderMenu />
              <Box display="flex" alignItems="center" fontSize="2xl">
                <Address />
              </Box>
            </Flex>
          </Box>



          <Routes>
            <Route path="/" element={<MyVehicles />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/Admin" element={<Admin />} />
            <Route path="/MyVehicles" element={<BlockCar />} />
            <Route path="/Catalog" element={<Catalog />} />
          </Routes>

          

          <Box bg="gray.700" boxShadow="md" mt={8}  position="fixed" bottom="0" width="100%">
            <Flex direction="column" justify="center" align="center" p={4}>
              <Text color="White" mb={2} fontSize="2xl">
                © 2023 BlockCar. Tous droits réservés.
              </Text>
              <Link href="https://github.com/Germain667/Alyra-projet-4" mb={2} color="white" fontSize="2xl">
                <Icon as={FaGithub} color="blue.500" mr={2} />
                Dépôt Git
              </Link>
            </Flex>
          </Box>
        </EthProvider>
      </ChakraProvider>
    </Router>
  </React.StrictMode>
);
