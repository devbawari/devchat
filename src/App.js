
import {Container,Box,VStack,HStack, Button, Input} from '@chakra-ui/react';
import Message from './Component/Message';
import {onAuthStateChanged,getAuth,GoogleAuthProvider,signInWithPopup,signOut} from "firebase/auth";
import {app} from './firebase';
import {getFirestore,addDoc, collection, serverTimestamp,onSnapshot,query,orderBy} from "firebase/firestore";
import { useEffect, useRef, useState } from 'react';
const auth = getAuth(app);
const db = getFirestore(app); 
const loginhandler = () => {
const provider = new GoogleAuthProvider();
signInWithPopup(auth, provider);
}
const logoutHandler = () => {
signOut(auth);
}
function App() {

  const[user,setUser] = useState(false);
  const[message,setMessage] = useState("");
  const[messages,setMessages] = useState([]);
  const divForScroll=useRef(null);
  const submitHandler = async(e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "Messages"),{text:message,uid:user.uid,uri:user.photoURL,creaedAt:serverTimestamp()});
      setMessage("");
      divForScroll.current.scrollIntoView({behavior:"smooth"});
    } catch (error) {
      alert(error)
    }
    }
useEffect(()=>{
  const q=query(collection(db, "Messages"),orderBy("creaedAt","asc"));
const unsubscribe=onAuthStateChanged(auth,(data)=>{
setUser(data);
})
const unsubsformessage=onSnapshot(q,(snapshot)=>{
setMessages(snapshot.docs.map((doc)=>{
  const id=doc.id;
 return {id,...doc.data()}})
)});  
return ()=>{
  unsubscribe()
  unsubsformessage()};
},[])
  return (
    <Box bg={"red.50"}>
     {
      user? <Container bg={"white"} h={'100vh'} w>
      <VStack  h={'full'} py={4} css={{"&::-webkit-scrollbar":{display:"none"}}}>
        <Button w={'full'} colorScheme='red'onClick={logoutHandler}>
          Logout</Button> 
          <VStack  h={'full'} w={'full'} overflowY={'auto'}>
            {
           messages.map((item)=>(
            <Message key={item.id} text={item.text} uri={item.uri} user={item.uid===user.uid?"me":"other"} />
          ))
           }
            
            <div ref={divForScroll}></div>
            </VStack > 
            <form style={{width:"100%"}} onSubmit={submitHandler} >
             <HStack>
             <Input placeholder='enter a message' value={message} onChange={(e)=>setMessage(e.target.value)}/>
              <Button type='submit' colorScheme='purple'>Send</Button>
             </HStack>
            </form>
        </VStack>
    </Container>:<VStack justifyContent={'center'} alignItems={'center'} h={"100vh"}>
      <Button colorScheme="purple" onClick={loginhandler}>Sign in with Google</Button>
    </VStack>
     }
    </Box>
  );
}

export default App;
