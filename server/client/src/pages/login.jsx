import { FormControl, FormLabel, Input, Button } from "@chakra-ui/react"
import { useState } from "react"

export default function Login() {
    const [rno, setRno] = useState('')
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
            <Button>Continue</Button>
        </FormControl>

        </>
    )
}