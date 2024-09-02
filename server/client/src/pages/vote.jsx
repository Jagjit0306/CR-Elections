import { useEffect, useState } from "react"
import { Box, Button, useToast, Text, VStack, HStack, Spinner } from "@chakra-ui/react"
import { FaCheck, FaArrowRight } from 'react-icons/fa'

import Container from "../components/container"
import Hero from "../components/hero"

function giveQuery(p) {
    if(!window.location.search) return false
    const queries = window.location.search.split('?')[1].split('&')
    const querieSet = {}
    queries.forEach((querie)=>{
        querieSet[querie.split('=')[0]] = querie.split('=')[1].replace(/\+/g, ' ')
    })
    if(querieSet.hasOwnProperty(p))
        return querieSet[p]
    else return false
}

function toQuery(jsonValue) {
    jsonValue = JSON.stringify(jsonValue)
    jsonValue = jsonValue.replace(/{/g, "")
    jsonValue = jsonValue.replace(/}/g, "")
    jsonValue = jsonValue.replace(/:/g, "=")
    jsonValue = jsonValue.replace(/,/g, "&")
    jsonValue = jsonValue.replace(/"/g, "")
    jsonValue = jsonValue.replace(/ /g, "+")
    return jsonValue
}

export default function Vote() {
    const toast = useToast()
    const [rno, setRno] = useState(giveQuery('rno')||'')
    const [otp, setOtp] = useState(giveQuery('key')||'')

    useEffect(()=>{
        if(!(giveQuery('rno')&&giveQuery('key'))) setPageState(3)
    },[])

    const [pageState, setPageState] = useState(2)
    // 0 for voting page
    // 1 for vote submitted
    // 2 checking otp
    // 3 invalid creds

    function CastVote(){
        const [buttonState, setButtonState] = useState(true)

        const [voteM, setVoteM] = useState()
        const [voteF, setVoteF] = useState()
        const giveVote = async()=>{
            if(voteM&&voteF){
                setButtonState(false)
                try{
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/vote`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            voteM: voteM,
                            voteF: voteF,
                            rno: rno,
                            otp: otp
                        })
                    })
                    if(response.status===401){
                        setButtonState(true)
                        toast({
                            title: 'Error encountered.',
                            description: "There was an error encountered while casting your vote.",
                            status: 'error',
                            duration: 4000,
                            isClosable: true,
                        })
                    }
                    else if(response.status===403){
                        setButtonState(true)
                        toast({
                            title: 'Unauthorized.',
                            description: "Credentials did not match.",
                            status: 'error',
                            duration: 4000,
                            isClosable: true,
                        })
                    }
                    else if(response.status===405){
                        setButtonState(true)
                        toast({
                            title: 'Vote already casted !',
                            description: "This student has already casted their vote.",
                            status: 'warning',
                            duration: 4000,
                            isClosable: true,
                        })
                    }
                    else if(response.status===500){
                        setButtonState(true)
                        toast({
                            title: 'Error encountered.',
                            description: "There was an error encountered while casting your vote.",
                            status: 'error',
                            duration: 4000,
                            isClosable: true,
                        })
                    }
                    else if(response.status===200){
                        toast({
                            title: 'Vote casted successfully !',
                            description: "All the best guys <3",
                            status: 'success',
                            duration: 4000,
                            isClosable: true,
                        })
                        setPageState(1)
                    }
                } catch(e){
                    setButtonState(true)
                    toast({
                        title: 'Error encountered.',
                        description: "There was an error encountered at our end.",
                        status: 'error',
                        duration: 4000,
                        isClosable: true,
                    })
                }
            } else {
                toast({
                    title: 'Cast your vote !',
                    description: "Kindly cast your vote before submitting.",
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                })
            }
        }

        function VoterCards(props) {
            function isSelected(){
                if(props.male){
                    if(voteM === props.name) return true
                    else return false
                } else {
                    if(voteF === props.name) return true
                    else return false
                }
            }
            return (
                <Box 
                onClick={()=>{
                    if(props.male) setVoteM(props.name)
                    else setVoteF(props.name)
                }}
                style={{backgroundColor:props.male?'#9fe2bf':'#ffd1dc', color:'black', padding:'15px', borderRadius:"10px",
                    border:isSelected()?'4px solid cyan':'4px solid white', cursor:'pointer'
                }}>
                    <Text style={{fontWeight:'600', color:"rgba(0,0,0,0.7)"}}>
                    {props.name}
                    </Text>
                </Box>
            )
        }

        return(
            <>
            <Text style={{fontWeight:'600', fontSize:"1.5rem"}}>
            Give your vote
            </Text>
            <VStack style={{border:"2px solid white", padding:'15px', borderRadius:"15px"}}>
                <Text>Boy CR</Text>
                <HStack>
                    <VoterCards name='B1' male/>
                    <VoterCards name='B2' male/>
                </HStack>
                <Text>Girl CR</Text>
                <HStack>
                    <VoterCards name='G1'/>
                    <VoterCards name='G2'/>
                </HStack>
            </VStack>
            <br />
            <Button isDisabled={!(voteF&&voteM)||!(buttonState)} colorScheme="blue" onClick={giveVote} rightIcon={buttonState?<FaArrowRight/>:<Spinner/>}>Submit</Button>
            </>
        )
    }

    function ThankYou(){
        return(
            <HStack>
                <Text style={{fontWeight:'500', color:'rgba(256,256,256,0.8)'}}>
                VOTE SUBMITTED
                </Text>
                <FaCheck color='limegreen'/>
            </HStack>
        )
    }

    function CheckingOTP() {

        useEffect(()=>{
            const pro = async()=>{
                try{
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/verOTP?${toQuery({
                        rno: rno, otp: otp
                    })}`,{
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })
                    if(response.status===401){
                        toast({
                            title: 'Error encountered.',
                            description: "There was an error encountered while verifying OTP.",
                            status: 'error',
                            duration: 4000,
                            isClosable: true,
                        })
                    }
                    else if(response.status===404){
                        toast({
                            title: 'Invalid Link !',
                            description: "The link you followed is not a valid link.",
                            status: 'error',
                            duration: 4000,
                            isClosable: true,
                        })
                        setPageState(3)
                    }
                    else if(response.status===200) {
                        setPageState(0)
                    }
                } catch(e){
                    toast({
                        title: 'Error encountered.',
                        description: "There was an error encountered at our end while verifying OTP.",
                        status: 'error',
                        duration: 4000,
                        isClosable: true,
                    })
                }
            }
            pro()
        })
        
        return (
            <Spinner size='xl'/>
        )
    }

    function INVCred() {
        return (
            <>
            <Text style={{textDecoration:"underline", textDecorationColor:"red"}}>
                Invalid Credentials
            </Text>
            <Text color={'gray'}>
                <em>
                The link you followed is either invalid or expired
                </em>
            </Text>
            </>
        )
    }

    const stateMapper = [
        <CastVote/>,
        <ThankYou/>,
        <CheckingOTP/>,
        <INVCred/>
    ]

    return (
        <Container>
        <Hero/>
        <br />
        {stateMapper[pageState]}
        </Container>
    )
}