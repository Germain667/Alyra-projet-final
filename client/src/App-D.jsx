import { EthProvider } from "./contexts/EthContext";
import BlockCar from "./components/BlockCar";
import { ChakraProvider } from '@chakra-ui/react'

function App() {
  return (
  <ChakraProvider>
    <EthProvider>
      <div id="App">
        <div className="container">
          <BlockCar />
        </div>
      </div>
    </EthProvider>
  </ChakraProvider>
  );
}

export default App;
