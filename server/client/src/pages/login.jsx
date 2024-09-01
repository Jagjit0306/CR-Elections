import { FormControl, FormLabel, Input, Button } from "@chakra-ui/react"
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
    const [pageState, setPageState] = useState(0)
    const [userName, setUserName] = useState()
    const [roll, setRoll] = useState()
    // 0 for initial
    // 1 for ok => greet with name, ask for email
    // 2 for already voted
    // 3 for wrong branch
    // 4 for roll number doesnt exist
    
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
        return (
            <>
            Welcome User {userName}

            proceed with email verification
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

    const stateMapper = [
        <Init/>,
        <Proceed/>,
        <AlreadyVoted/>,
        <WrongBranch/>,
        <InvRNO/>
    ]

    return (
        <>
            {stateMapper[pageState]}
        </>
    )
}