import React from 'react'
import {Avatar,HStack,Text} from "@chakra-ui/react"
const Message = ({text,uri,user="other"}) => {
  return (
    <HStack bg={'gray.100'} py={2} px={user==="me"?'4':"2"} borderRadius={'base'} alignSelf={user==="other"?"flex-start":"flex-end"}>
        {
        user==="other" &&   <Avatar src={uri}/>
      }
        <Text>{text}</Text>
      {
        user==="me" &&   <Avatar src={uri}/>
      }
    </HStack>
  )
}

export default Message