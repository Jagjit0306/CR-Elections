import { FormControl, FormLabel, Input, Button, useToast } from "@chakra-ui/react"

import { useState } from "react"

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
                ENTER YOUR ROLL NUMBER
                <FormControl>
                    <FormLabel>Enter your roll number</FormLabel>
                    <Input 
                        type="number"
                        value={rno}
                        onChange={(e)=>{setRno(e.target.value)}}
                        id="rno"
                        placeholder="241040XX"
                    />
                    <Button onClick={getStatus} >Continue</Button>
                </FormControl>
            </>
        )
    }

    function Proceed() {

        function EmailForm(){
            const [email, setEmail] = useState('')

            const verifyEmail = async()=>{
                if(email.includes('.ec.24@nitj.ac.in')){
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
                            toast({
                                title: 'User not found.',
                                description: "Student info not found.(0)",
                                status: 'error',
                                duration: 4000,
                                isClosable: true,
                            })
                        }
                        else if(response.status===403){
                            toast({
                                title: 'Email incorrect.',
                                description: "Kindly cross-check and enter correct email.",
                                status: 'error',
                                duration: 4000,
                                isClosable: true,
                            })
                        }
                        else if(response.status===404){
                            toast({
                                title: 'User not found.',
                                description: "Student info not found.(1)",
                                status: 'error',
                                duration: 4000,
                                isClosable: true,
                            })
                        }
                    } catch(e) {
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
                <FormControl>
                    <FormLabel>Enter your college email</FormLabel>
                    <Input
                        type="text"
                        value={email}
                        placeholder={'johnpork.ec.24@nitj.ac.in'}
                        id='email'
                        onChange={(e)=>{setEmail(e.target.value)}}
                    />
                    <Button onClick={verifyEmail}>Continue</Button>
                </FormControl>
                </>
            )
        }

        return (
            <>
            Welcome User {userName}
            <br />
            proceed with email verification
            <EmailForm/>
            </>
        )
    }

    function AlreadyVoted() {
        return (
            <>
            Already Voted bro
            </>
        )
    }

    function WrongBranch() {
        return (
            <>
            Only ECE peeps allowed, cope
            </>
        )
    }

    function InvRNO() {
        return (
            <>
            Roll number invalid
            </>
        )
    }

    function EmailSent() {
        return (
            <>
            Kindly check your email to vote
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
        <>
            {stateMapper[pageState]}
        </>
    )
}