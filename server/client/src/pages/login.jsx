import { FormControl, Spinner, Text, FormLabel, Input, Button, useToast, VStack } from "@chakra-ui/react"
import { useState } from "react"
import { FaArrowRight } from "react-icons/fa"

import Hero from "../components/hero"
import Container from "../components/container"

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

export default function Login() {
    const toast = useToast()

    const [pageState, setPageState] = useState(0)
    const [userName, setUserName] = useState()
    const [roll, setRoll] = useState()
    // 0 for initial
    // 1 for ok => greet with name, ask for email
    // 2 for already voted
    // 3 for wrong branch
    // 4 for roll number doesnt exist
    // 5 for email sent
    
    function Init() {
        const [rno, setRno] = useState('')
        const getStatus = async()=>{
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/greet?${toQuery({rno:rno})}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                if(response.status===403){ //rno not sent
                    // bro stop erring
                }
                else if(response.status===404){ //roll number doesnt exist
                    setPageState(4)
                }
                else if(response.status===405){ //already voted
                    setPageState(2)
                }
                else if(response.status===401){ //wrong branch
                    setPageState(3)
                }
                else if(response.status===200){
                    const data = await response.json()
                    if(data){
                        setRoll(rno)
                        // get name by data.name
                        setUserName(data.name)
                        setPageState(1)
                    }
                }
            }
            catch(e) {
                console.log(e)
            }
        }
        
        return (
            <>
                <FormControl>
                    <VStack>
                        <FormLabel>Enter your roll number</FormLabel>
                        <Input 
                            type="number"
                            value={rno}
                            style={{textAlign:'center'}}
                            onChange={(e)=>{setRno(e.target.value)}}
                            id="rno"
                            placeholder="241040XX"
                        />
                        <Button colorScheme="teal" isDisabled={!rno} onClick={getStatus} rightIcon={<FaArrowRight/>} >Continue</Button>
                    </VStack>
                </FormControl>
            </>
        )
    }

    function Proceed() {

        function EmailForm(){
            const [email, setEmail] = useState('')
            const [buttonState, setButtonState] = useState(true)

            const verifyEmail = async()=>{
                if(email.includes('.ec.24@nitj.ac.in')){
                    setButtonState(false)
                    try{
                        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/verEmail`, {
                            method:'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                email: email,
                                rno: roll
                            })
                        })
                        if(response.status===200){
                            setPageState(5)
                        }
                        else if(response.status===401){
                            setButtonState(true)
                            toast({
                                title: 'User not found.',
                                description: "Student info not found.(0)",
                                status: 'error',
                                duration: 4000,
                                isClosable: true,
                            })
                        }
                        else if(response.status===403){
                            setButtonState(true)
                            toast({
                                title: 'Email incorrect.',
                                description: "Kindly cross-check and enter correct email.",
                                status: 'error',
                                duration: 4000,
                                isClosable: true,
                            })
                        }
                        else if(response.status===404){
                            setButtonState(true)
                            toast({
                                title: 'User not found.',
                                description: "Student info not found.(1)",
                                status: 'error',
                                duration: 4000,
                                isClosable: true,
                            })
                        }
                    } catch(e) {
                        setButtonState(true)
                        toast({
                            title: 'Error encountered',
                            description: "There was an issue encountered at our end.",
                            status: 'error',
                            duration: 4000,
                            isClosable: true,
                        })
                        console.log(e)}
                }
                else {
                    toast({
                        title: 'Email format invalid',
                        description: "Kindly use the correct email.",
                        status: 'warning',
                        duration: 4000,
                        isClosable: true,
                    })
                }
            }

            return(
                <>
                <FormControl style={{
                    // color:'black',
                    // border:'4px solid lightgray',
                    // backgroundColor:'rgba(181, 215, 228, 0.8)',
                    // borderRadius: '15px',
                    // padding:'20px'
                }}>
                    <VStack>
                        <FormLabel>Enter your college email</FormLabel>
                        <Input
                            type="text"
                            value={email}
                            style={{textAlign:'center'}}
                            placeholder={'johndoe.ec.24@nitj.ac.in'}
                            id='email'  
                            onChange={(e)=>{setEmail(e.target.value)}}
                        />
                        <Button colorScheme="teal" isDisabled={!email||(!buttonState)} onClick={verifyEmail} rightIcon={buttonState?<FaArrowRight/>:<Spinner/>}>Continue</Button>
                    </VStack>
                </FormControl>
                </>
            )
        }

        function capitalizeFullName(fullName) {
            const nameParts = fullName.split(' ');
          
            // Capitalize the first letter of each part
            const formattedNameParts = nameParts.map((part) => {
              return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
            });
          
            // Join the formatted parts back into the full name
            const formattedFullName = formattedNameParts.join(' ');
          
            return formattedFullName;
        }          

        return (
            <>
            <Text style={{
                textAlign:'center',
                fontWeight:'700',
                fontSize:'2rem',
                color:'lightgray'
            }}>
                Heyy {capitalizeFullName(userName)} !
            </Text>
            <em style={{color:"darkgray"}}>
                proceed with email verification
            </em>
            <EmailForm/>
            </>
        )
    }

    function AlreadyVoted() {
        return (
            <>
            <Text>This Student has already voted for CR Elections...</Text>
            <Button colorScheme="blue" onClick={()=>{setPageState(0)}}>Go Back</Button>
            </>
        )
    }

    function WrongBranch() {
        return (
            <>
            <Text>Only ECE 1st year is allowed to vote for these elections...</Text>
            <Button colorScheme="blue" onClick={()=>{setPageState(0)}}>Go Back</Button>
            </>
        )
    }
    
    function InvRNO() {
        return (
            <>
            <Text>Roll number not recognized...</Text>
            <Button colorScheme="blue" onClick={()=>{setPageState(0)}}>Go Back</Button>
            </>
        )
    }

    function EmailSent() {
        return (
            <>
            <Text style={{textAlign:"center"}}>
                One-time use email sent...
                <br /><br />
                Click the link in the email to cast your vote.
                <br /><br />
                Kindly check your inbox !
            </Text>
            </>
        )
    }

    const stateMapper = [
        <Init/>,
        <Proceed/>,
        <AlreadyVoted/>,
        <WrongBranch/>,
        <InvRNO/>,
        <EmailSent/>
    ]

    return (
        <Container>
            <Hero/>
            {stateMapper[pageState]}
        </Container>
    )
}