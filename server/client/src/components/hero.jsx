import { Text, HStack } from "@chakra-ui/react"

import nitj from '../media/nitj.png'

export default function Hero() {
    return (
        <>
        <HStack shadow={'lg'} style={{
            backgroundColor:"rgba(256,256,256,0.55)",
            borderRadius:'25px',
            padding:'30px',
            marginBottom:"10px",
            backdropFilter:"blur(10px)",
            WebkitBackdropFilter:"blur(10px)"
        }}>
            <Text
                style={{
                    fontSize:'2rem',
                    fontWeight:'600'
                }}
            >CR Elections - ECE'28</Text>
            <img style={{height:'15vh'}} src={nitj} alt="NITJ-logo" />
        </HStack>
        </>
    )
}