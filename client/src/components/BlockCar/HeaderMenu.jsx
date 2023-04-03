import { Link } from 'react-router-dom';
import { Box, Text } from '@chakra-ui/react';
import { useIsOwner } from "../../hooks/useIsOwner";
import useEth from "../../contexts/EthContext/useEth";

function HeaderMenu() {
  const { state: { accounts } } = useEth();
  const { isOwner } = useIsOwner(accounts);

  const displayAdminButton = 
              <><Box mx={4}>
                <Link to="/Admin">
                  <Text fontSize="large" fontWeight="bold" color="white" _hover={{color: "blue.600"}}>Administrateur</Text>
                </Link>
                </Box>
              </>;

  return (
    <>
      <Box display="flex" alignItems="right" ml="auto" mr={20}>
        <Box mx={4}>
          <Link to="/">
            <Text fontSize="large" fontWeight="bold" color="white" _hover={{color: "blue.600"}}>Accueil</Text>
          </Link>
        </Box>
        <Box mx={4}>
          <Link to="/MyVehicles">
            <Text fontSize="large" fontWeight="bold" color="white" _hover={{color: "blue.600"}}>Mes véhicules</Text>
          </Link>
        </Box>

        {isOwner && displayAdminButton}

        <Box mx={4}>
          <Link to="/Catalog">
            <Text fontSize="large" fontWeight="bold" color="white" _hover={{color: "blue.600"}}>Catalogue</Text>
          </Link>
        </Box>
      </Box>
    </>
  );
}

export default HeaderMenu;
