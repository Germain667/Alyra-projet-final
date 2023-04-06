import {Container,SimpleGrid,Image,Flex, Heading,Text,Stack,Box} from '@chakra-ui/react';

function Home() {

  return (
    <>
        <Heading as="h1" size="xl" textAlign="center" mb={8}>
            La transparence de votre véhicule
        </Heading>
        <Text textAlign="center" >Accédez à une information exhaustive, authentifiée et totalement fiable pour des ventes entre particuliers sérénisée</Text>
        <Container maxW={'5xl'} py={12}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                <Stack spacing={4}>
                <Heading>Ne perdez plus jamais le fil de l'historique de votre véhicule</Heading>
                <Text color={'gray.500'} fontSize={'lg'}>
                Propriétaire, enregistrez de manière ultra-sécurisée les données essentielles concernant la vie de votre véhicule. 
                Grâce à notre technologie blockchain, conservez à long terme toutes ces informations avec la garantie qu'elles ne seront jamais altérées
                </Text>
                </Stack>
                <Flex>
                <Image
                    rounded={'md'}
                    alt={'feature image'}
                    src={
                    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'
                    }
                    objectFit={'cover'}
                />
                </Flex>
            </SimpleGrid>
        </Container>

        <Container maxW={'5xl'} py={12}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                <Flex>
                    <Image
                        rounded={'md'}
                        alt={'feature image'}
                        src={
                        'https://images.unsplash.com/photo-1544896478-d5b709d413c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'
                        }
                        objectFit={'cover'}
                    />
                </Flex>
                <Stack spacing={4}>
                <Heading>Réduisez les risques de mauvaises surprises</Heading>
                <Text color={'gray.500'} fontSize={'lg'}>
                Futur acquéreur d'un véhicule d'occasion, donnez vous les moyens d'acheter en toute confiance en étant sûr et sereins sur les informations que vous collectez
                <br />    - Transparence renforcée
                <br />    - Fiabilité des informations garanties
                <br />    - Plus de vices cachés, plus de fraude
                </Text>
                </Stack>
            </SimpleGrid>
        </Container>

        <Container maxW={'5xl'} py={12}>
        <Box mb={{ base: 8, md: 20 }}>
              <Text
                fontFamily={'heading'}
                fontWeight={700}
                textTransform={'uppercase'}
                mb={3}
                fontSize={'xl'}
                color={'gray.500'}>
                Notre solution
              </Text>
              <Heading
                color={'black'}
                mb={5}
                fontSize={{ base: '3xl', md: '5xl' }}>
                Simple, continue, sécurisée
              </Heading>
              <Text fontSize={'xl'} color={'gray.400'}>
              Grâce à la technologie Blockchain, gardez simplement une trace de tous les évènements de la vie de votre véhicule
              </Text>
            </Box>
        </Container>

        <Container maxW={'5xl'} py={12}>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
        <Stack>
                <Flex
                w={16}
                h={16}
                align={'center'}
                justify={'center'}
                color={'white'}
                rounded={'full'}
                bg={'gray.100'}
                mb={1}>
                    <Text fontWeight={1000}  color={'gray.800'}>1</Text>
            </Flex>
            <Text fontWeight={600}>Stockage des donénes</Text>
            <Text color={'gray.600'}>Enregistrez de manière sécurisée l'ensemble des informations et les pièces justificatives de votre véhicule</Text>
            </Stack>
            <Stack>
                <Flex
                w={16}
                h={16}
                align={'center'}
                justify={'center'}
                color={'white'}
                rounded={'full'}
                bg={'gray.100'}
                mb={1}>
                <Text fontWeight={1000}  color={'gray.800'}>2</Text>
            </Flex>
            <Text fontWeight={600}>Qualité de l'information</Text>
            <Text color={'gray.600'}>Soyez certain que les données enregistrées ne seront jamais corrompues et restez certain à 100% de leur fiabilité</Text>
            </Stack>
            <Stack>
                <Flex
                w={16}
                h={16}
                align={'center'}
                justify={'center'}
                color={'white'}
                rounded={'full'}
                bg={'gray.100'}
                mb={1}>
                <Text fontWeight={1000}  color={'gray.800'}>3</Text>
            </Flex>
            <Text fontWeight={600}>Continuité de l'exercice</Text>
            <Text color={'gray.600'}>Accédez à un historique indélébile  qui suit la vie du véhicule quels que soient les changements de propriétaires</Text>
            </Stack>
        </SimpleGrid>
        </Container>

        <br />
        <br />
        <br />
        <br />
    </>
    );
}

export default  Home;