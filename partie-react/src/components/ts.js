import { get, django, search } from "../store/apiCall";
import { Heading } from "@chakra-ui/react";
import { Spinner,Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box } from '@chakra-ui/react'
import { ChakraProvider } from '@chakra-ui/react'



function Ts(){
    async function  ge(){
        const data = await get();
    }
    async function fe(){
        const data = await django();
    }
    const userObject = JSON.parse(localStorage.getItem('user'));
    console.log(userObject.userS.id);            
    return(
        <>
        <ChakraProvider>

        <Heading>hello</Heading>
        </ChakraProvider>
        <ChakraProvider>
        <Spinner />
        <Accordion allowMultiple>
            <AccordionItem>
                <h2>
                <AccordionButton>
                    
                    <AccordionIcon />
                </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat.
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
        </ChakraProvider>
    {<h1 onClick={ge}>donia</h1>}
        <h1 onClick={fe}>django</h1>
        
        </>
    );
}
export default Ts;