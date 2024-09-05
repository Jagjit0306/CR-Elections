import { Center, Heading, VStack, HStack, Text, Box, useToast, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaGithub } from "react-icons/fa";

import Hero from './hero'

export default function Container(props) {
    const toast = useToast()
    const [pageState, setPageState] = useState(true)
    const [ended, setEnded] = useState(false)
    let lower = 1725539400000 //set upper and lower time in ms since unix epoch https://currentmillis.com/
    let upper = 1725555600000

    useEffect(()=>{
        const fn = async()=>{
            try{
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/time`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                if(response.status===200){
                    const data = await response.json()
                    if(data){
                        if(data.time>lower && data.time<upper){
                            setPageState(false)
                        }
                        if(data.time>upper) setEnded(true)
                    }
                }
            } catch(e){
                toast({
                    title: 'Error encountered.',
                    description: "There was an error encountered while communicating with server.",
                    status: 'error',
                    duration: 4000,
                    isClosable: true,
                })
            }
        }
        fn()
        
        // setPageState(false) //remove this
    })

    function Wait() {
        return(
            <>
            <Heading>
                Voting not open
            </Heading>
            <Text color='gray'>
                <em>
                    Voting 
                    {
                        ended?
                        ' has closed'
                        :
                        ' is yet to begin...'
                    }
                </em>
            </Text>
            {!ended?'':
                <Link to='/result'>
                <Button colorScheme="green">View voting result</Button>
                </Link>
            }
            </>
        )
    }

    function ResultHandler() {
        const [resultState, setResultState] = useState(false)

        useEffect(()=>{
            const fn = async()=>{
                try{
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/time`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    if(response.status===200){
                        const data = await response.json()
                        if(data){
                            if(data.time>upper){
                                setResultState(true)
                            }
                        }
                    }
                } catch(e){
                    toast({
                        title: 'Error encountered.',
                        description: "There was an error encountered while communicating with server.",
                        status: 'error',
                        duration: 4000,
                        isClosable: true,
                    })
                }
            }
            fn()

            // setResultState(true) //comment this later
        })

        return (
            <>
            {
                resultState?props.children:
                <>
                <Heading>
                    Results not announced
                </Heading>
                <Text color='gray'>
                    <em>
                        Kindly wait till the result declaration date...
                    </em>
                </Text>
                <Link to='/'>
                <Button colorScheme="green">Vote for CR !</Button>
                </Link>
                </>
            }
            </>
        )
    }

    return (
        <>
        <Center style={{
            minHeight:"100svh",
            backgroundColor: 'black',
            color: 'white',
            // padding:'15px'
        }}>
            <VStack justifyContent={'space-between'} padding={'15px'}>
                <Box style={{
                    alignItems:"center", justifyContent: 'center', 
                    gap: '15px', overflowY:"auto", boxSizing:"border-box", minHeight:"90svh",
                    display:"flex", flexDirection:"column"}}>
                    <Hero/>
                    {
                        props.result?
                        <ResultHandler/>
                        :(pageState ? <Wait/> : props.children)
                    }
                </Box>
                <Link to='https://www.github.com/Jagjit0306' style={{width:'100%', color:"gray"}}>
                    <HStack justifyContent={'center'}>
                        <Text>
                            Developed by 
                        </Text>
                        <HStack justifyContent={'space-evenly'}>
                            <Text>
                            Jagjit0306 
                            </Text>
                            <FaGithub/>
                        </HStack>
                    </HStack>
                </Link>
            </VStack>
        </Center>
        </>
    )
}