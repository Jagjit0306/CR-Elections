import { Center, Heading, VStack, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function Container(props) {
    const [pageState, setPageState] = useState(true)

    useEffect(()=>{
        // set time limit and set the pagestate to false then
        let lower //set upper and lower time in ms since unix epoch https://currentmillis.com/
        let upper
        if(Date.now()>lower && Date.now()<upper){
            setPageState(false)
        }
        setPageState(false) //remove this
    },[])

    function Wait() {
        return(
            <>
            <Heading>
                Voting not open
            </Heading>
            <Text color='gray'>
                <em>
                    Voting has either closed or is yet to begin...
                </em>
            </Text>
            </>
        )
    }

    return (
        <Center style={{
            height:"100%",
            backgroundColor: 'black',
            color: 'white',
            padding:'15px'
        }}>
            <VStack style={{alignItems:"center", justifyContent: 'center', gap: '15px'}}>
                {
                    pageState ? <Wait/> : props.children
                }
            </VStack>
        </Center>
    )
}