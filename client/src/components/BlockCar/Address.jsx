import useEth from "../../contexts/EthContext/useEth";
import { Text } from "@chakra-ui/react";

function Address() {
  const { state: { accounts } } = useEth();

  return (
    <div className="addr">
        <Text color="white" mb={2} align="center">
          Connected address : <>
          {accounts && accounts[0] && <>{accounts[0]}</>}
          </>
        </Text>
    </div>
    );
}

export default Address;