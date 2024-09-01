import { useEffect, useState } from "react"
import { Button, useToast } from "@chakra-ui/react"

function giveQuery(p) {
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
    const [rno, setRno] = useState(giveQuery('rno'))
    const [otp, setOtp] = useState(giveQuery('key'))
    // console.log("Rno is", rno)

    const [pageState, setPageState] = useState(2)
    // 0 for voting page
    // 1 for vote submitted
    // 2 checking otp
    // 3 invalid creds

    function CastVote(){
        const [voteM, setVoteM] = useState('shanu')
        const [voteF, setVoteF] = useState('bhanu')
        const giveVote = async()=>{
            if(voteM&&voteF){
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
                        toast({
                            title: 'Error encountered.',
                            description: "There was an error encountered while casting your vote.",
                            status: 'error',
                            duration: 4000,
                            isClosable: true,
                        })
                    }
                    else if(response.status===403){
                        toast({
                            title: 'Unauthorized.',
                            description: "Credentials did not match.",
                            status: 'error',
                            duration: 4000,
                            isClosable: true,
                        })
                    }
                    else if(response.status===405){
                        toast({
                            title: 'Vote already casted !',
                            description: "This student has already casted their vote.",
                            status: 'warning',
                            duration: 4000,
                            isClosable: true,
                        })
                    }
                    else if(response.status===500){
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

        return(
            <>
            Give your vote
            <br />
            <Button isDisabled={!(voteF&&voteM)} onClick={giveVote}>Submit</Button>
            </>
        )
    }

    function ThankYou(){
        return(
            <>
            Vote submitted
            </>
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
            <>
            Checking OTP
            </>
        )
    }

    function INVCred() {
        return (
            <>
            Invalid Credentials
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
        <>
        VOTING PAGE
        <br />
        {stateMapper[pageState]}
        </>
    )
}