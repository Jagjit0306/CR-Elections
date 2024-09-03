import { useEffect, useState } from "react"
import { HStack, useToast, Text, Spinner, Heading } from "@chakra-ui/react"
import Container from "../components/container"

export default function Result() {
    const [resultData, setResultData] = useState()
    const toast = useToast()

    useEffect(()=>{
        const func = async()=>{
            try{
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/result`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                if(response.status === 500) {
                    toast({
                        title: 'Error encountered.',
                        description: "There was an error encountered at our end while fetching results.",
                        status: 'error',
                        duration: 4000,
                        isClosable: true,
                    })
                } else if(response.status === 200) {
                    const data = await response.json()
                    if(data) setResultData(data.data)
                }
            } catch(e){
                toast({
                    title: 'Error encountered.',
                    description: "There was an error encountered at our end while fetching results.",
                    status: 'error',
                    duration: 4000,
                    isClosable: true,
                })
            }
        }
        func()
    },[])

    function Card(props) {
        return (
            <HStack style={{border:"1px solid black", padding:"5px", margin:'5px'}}>
                <Text>
                    {props.data.name}
                </Text>
                <Text style={{border:"1px solid lightgray", borderRadius:'15px', padding:'15px', margin:"10px"}}>
                    {props.data.votes} votes
                </Text>
            </HStack>
        )
    }

    return (
        <Container result>
            <Heading>RESULT</Heading>
            {
                !(resultData&&resultData.length)?
                <Text>No votes found...</Text>:
                <>
                <Text textDecoration={'underline'} fontWeight={'600'} color={'#9fe2bf'}>
                    BOY CR VOTES
                </Text>
                {
                    !resultData?<Spinner/>:
                    resultData.filter(r=> r.gender==='M').map(r=>(
                        <Card data={r} />
                    ))
                }
                <Text textDecoration={'underline'} fontWeight={'600'} color={'#ffd1dc'}>
                    GIRL CR VOTES
                </Text>
                {
                    !resultData?<Spinner/>:
                    resultData.filter(r=> r.gender==='F').map(r=>(
                        <Card data={r} />
                    ))
                }
                </>
            }
        </Container>
    )
}