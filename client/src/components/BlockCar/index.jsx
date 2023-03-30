import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import Cta from "./Cta";
import Contract from "./Contract";
import ContractBtns from "./ContractBtns";

import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";
import { Box, Text, Flex } from "@chakra-ui/react";

function BlockCar() {
  const { state } = useEth();
  const [value, setValue] = useState("?");

  const blockCar =
    <>

      <Cta />


      <Box bg="gray.700" boxShadow="md" mt={8} width="100%">
        <Flex direction="column" justify="center" align="center" p={4}>
          <Text color="white" mb={2}>
            Test affichage
          </Text>
        </Flex>
      </Box>

      <div className="contract-container">
        <Contract value={value} />
        <ContractBtns setValue={setValue} />
      </div>

    </>;

  return (
    <div className="blockCar">
      {console.log(state)}
      {
        !state.artifact ? <NoticeNoArtifact /> :
          !state.contract ? <NoticeWrongNetwork /> :
          blockCar
      }
    </div>
  );
}

export default BlockCar;
