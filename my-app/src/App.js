import logo from './garlic.png'
import './App.css';
import React, { useState, useEffect } from 'react'
import axios from 'axios';

// 1. import `ChakraProvider` component
import { ChakraProvider, FormControl, HStack } from '@chakra-ui/react'
import { SimpleGrid, Heading, Text, Image, Input, Divider, Stack, Select, Checkbox } from '@chakra-ui/react'
import { Card, CardHeader, CardBody, Box, Button, CheckboxGroup } from '@chakra-ui/react'
import { Spinner } from '@chakra-ui/react'

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react'

function App() {

  const [input, setInput] = useState("");
  const [lyrics, setLyrics] = useState(true)
  const [jokes, setJokes] = useState(true)
  const [phrases, setPhrases] = useState(true)
  const [proverbs, setProverbs] = useState(true)
  const [urban, setUrban] = useState(true)
  const [anime, setAnime] = useState(true)
  const [nsfw, setNSFW] = useState(false)

  const [helperText, setHelperText] = useState("Ready to generate puns...");

  const [puns, setPuns] = useState([]);
  const [isFetching, setIsFetching] = useState(false);


  function handleGenerate() {
    setIsFetching(true);
    setHelperText("Generating puns...");
    axios.post('http://127.0.0.1:5000/query', {
      input: input
    })
      .then((response) => {
        let results = JSON.parse(response.data.output);
        console.log(Object.keys(results).length);

        setPuns([...puns, ...results]);
        setIsFetching(false);
        let num_puns = Object.keys(results).length;
        if (num_puns === 0) {
          setHelperText("Failed to generate puns :(");
        }
        else {
          setHelperText(`Success! Generated ${num_puns} new puns...`);
        }
      })
      .catch((error) => {
        console.log(error)
        setHelperText("Something went wrong :(");
      });
  };

  function deletePuns() {
    setPuns([]);
  }

  return (
    <ChakraProvider>

      <SimpleGrid columns={2} p={20}>
        <Card variant={'outline'} borderColor={'gray'} background={'gray.50'}>
          <CardHeader >
            <HStack >
              <Heading size='lg'> PunGenT</Heading>
              <Image w={"50px"} h={"40px"} src={logo} />
            </HStack>
            <Text fontSize='xs'> Your one-stop-shop for wordplay!</Text>
            <HStack>
              {
                isFetching && <Spinner
                  thickness='4px'
                  speed='0.65s'
                  emptyColor='gray.200'
                  color='teal.500'
                  size='lg'
                />
              }

              <Input placeholder='Your idea here!' size='md' width={'auto'} onKeyUp={(e) => setInput(e.target.value)} />
              <Button colorScheme='green' onClick={handleGenerate}> Generate</Button>
              <Button colorScheme='red' onClick={deletePuns}> Delete Puns</Button>
            </HStack>

          </CardHeader>
          <CardBody>
            <Box w='md' h='150px' p={4} borderWidth='2px' overflowY={'scroll'} overflowX={'scroll'}>
              <Text> {helperText}</Text>
            </Box>
          </CardBody>
        </Card>

        <Card variant={'outline'} borderColor={'gray'} background={'gray.50'}>
          <CardHeader>
            <Heading size='md'> Filters</Heading>
          </CardHeader>
          <CardBody>
            <Stack align={'center'} h='100px'>
              <Divider orientation='horizontal' />
              <HStack >
                <CheckboxGroup colorScheme='green'>
                  <HStack>
                    <Stack spacing={[1, 5]} direction={['row', 'column']}>
                      <Checkbox name='lyrics' onChange={(e) => setLyrics(e.target.checked)}>Lyrics</Checkbox>
                      <Checkbox name='phrases' onChange={(e) => setPhrases(e.target.checked)}>Phrases</Checkbox>
                      <Checkbox name='urban' onChange={(e) => setUrban(e.target.checked)}>Urban</Checkbox>
                    </Stack>
                    <Stack spacing={[1, 5]} direction={['row', 'column']}  >
                      <Checkbox name='jokes' onChange={(e) => setJokes(e.target.checked)}>Jokes</Checkbox>
                      <Checkbox name='proverbs' onChange={(e) => setProverbs(e.target.checked)}>Proverbs</Checkbox>
                      <Checkbox name='anime' onChange={(e) => setAnime(e.target.checked)}>Anime Quotes</Checkbox>
                    </Stack>
                  </HStack>
                </CheckboxGroup>
              </HStack>
              <Divider orientation='horizontal' colorScheme={'blackAlpha'} />
              <Select align='center' pl='10px' w='md' placeholder='Select Language'>
                <option value='option1'>English</option>
                <option value='option2'>Spanish</option>
                <option value='option3'>French</option>
              </Select>

              <Checkbox colorScheme='red' value='nsfw'> Include NSFW puns</Checkbox>
            </Stack>
          </CardBody>
        </Card>
      </SimpleGrid>
      <SimpleGrid columns={1} pr={20} pl={20} mt={-18}>
        <Card>
          <TableContainer>
            <Table variant='striped' colorScheme='teal'>
              <Thead>
                <Tr>
                  <Th>Original</Th>
                  <Th>Rhymed</Th>
                  <Th>Source</Th>
                </Tr>
              </Thead>
              <Tbody>
                {
                  puns.map((entry) => {
                    return (
                      <Tr>
                        <Td>{entry.original_phrase}</Td>
                        <Td>{entry.rhymed_phrase}</Td>
                        <Td>{entry.metadata.source}</Td>
                      </Tr>
                    )
                  })
                }
              </Tbody>
            </Table>
          </TableContainer>
        </Card>
      </SimpleGrid>

    </ChakraProvider >
  )
}

export default App;
