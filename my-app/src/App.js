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

  const [anime, setAnime] = useState(true)
  const [formalIdioms, setFormalIdioms] = useState(true)
  const [commonPhrases, setCommonPhrases] = useState(true)
  const [staticIdioms, setStaticIdioms] = useState(true)
  const [movies, setMovies] = useState(true)
  const [urbanDictionary, setUrbanDictionary] = useState(true)
  const [genius, setGenius] = useState(true)
  const [nsfw, setNSFW] = useState(false)

  const [helperText, setHelperText] = useState("Ready to generate puns...");

  const [puns, setPuns] = useState([]);
  const [isFetching, setIsFetching] = useState(false);


  function handleGenerate() {
    setIsFetching(true);
    setHelperText("Generating puns...");
    axios.post('http://127.0.0.1:5000/query', {
      input: input,
      filters: {
        "Anime": anime,
        "Formal Idioms": formalIdioms,
        "Common Phrases": commonPhrases,
        "Static Idioms": staticIdioms,
        "Movies": movies,
        "Urban Dictionary": urbanDictionary,
        "Genius": genius,
      },
      allowNSFW: nsfw,
    })
      .then((response) => {
        console.log(typeof response.data.output);
        console.log(response.data.output);
        let results = JSON.parse(response.data.output);

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
                <CheckboxGroup colorScheme='blue'>
                  <HStack>
                    <Stack spacing={[1, 5]} direction={['row', 'column']}>
                      <Checkbox name='anime' defaultChecked onChange={(e) => setAnime(e.target.checked)}>Anime</Checkbox>
                      <Checkbox name='formal-idioms' defaultChecked onChange={(e) => setFormalIdioms(e.target.checked)}>Formal Idioms</Checkbox>
                    </Stack>
                    <Stack spacing={[1, 5]} direction={['row', 'column']}>
                      <Checkbox name='common-phrases' defaultChecked onChange={(e) => setCommonPhrases(e.target.checked)}>Common Phrases</Checkbox>
                      <Checkbox name='static-idioms' defaultChecked onChange={(e) => setStaticIdioms(e.target.checked)}>Static Idioms</Checkbox>
                    </Stack>
                    <Stack spacing={[1, 5]} direction={['row', 'column']}  >
                      <Checkbox name='movies' defaultChecked onChange={(e) => setMovies(e.target.checked)}>Movies</Checkbox>
                      <Checkbox name='urban-dictionary' defaultChecked onChange={(e) => setUrbanDictionary(e.target.checked)}>Urban Dictionary</Checkbox>
                    </Stack>
                    <Stack spacing={[1, 5]} direction={['row', 'column']}  >
                      <Checkbox name='Genius' defaultChecked onChange={(e) => setGenius(e.target.checked)}>Genius Top 100</Checkbox>
                      <Checkbox name='nsfw' colorScheme="red" defaultChecked onChange={(e) => setNSFW(e.target.checked)}>Allow NSFW</Checkbox>
                    </Stack>
                  </HStack>
                </CheckboxGroup>
              </HStack>
              <Divider orientation='horizontal' colorScheme={'blackAlpha'} />
              <Select align='center' pl='10px' w='md' isReadOnly defaultValue='English'>
                <option value='English'>English</option>
              </Select>
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
