import React, { useEffect, useState,useRef, useLayoutEffect } from 'react';
import { Heading, Box, InputGroup, Input, InputRightElement, Text, HStack, VStack } from '@chakra-ui/react';
import { FiSend } from "react-icons/fi"
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { getMessageList } from '../features/messageSlice';
import axios from 'axios';
import { format } from 'date-fns';

const socket = io.connect("https://webhook-pbyy.onrender.com")


function ChatWindow({ selectedContact }) {
    const [reply, setReply] = useState('')
    const dispatch = useDispatch()
    const messageContainerRef = useRef(null);


    useEffect(() => {
        dispatch(
            getMessageList(selectedContact.phoneNumber)
        )
        socket.on("webhookNotificationMessage", (data) => {
            dispatch(getMessageList(selectedContact.phoneNumber))
        })
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight - messageContainerRef.current.clientHeight;
        }
    }, [selectedContact, dispatch]);

    useLayoutEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop =
                messageContainerRef.current.scrollHeight -
                messageContainerRef.current.clientHeight;
        }
    }, []);

    const messageList = useSelector((state) => state.message.messageList);
    const conversationId = useSelector((state) => state.message.conversationId);
    const expirationTime = useSelector((state) => state.message.expirationTime);

    const expirationDate = new Date(Number(expirationTime) * 1000);
    const formattedExpirationDate = expirationDate.toLocaleString(); // Adjust this as per your preference



    const sendMessage = async () => {
        if (reply.trim() !== '') {
            try {
                const response = await axios.post('https://live-agent-backend.onrender.com/api/messages/send', {
                    to: selectedContact.phoneNumber,
                    content: reply,
                });
                if (messageContainerRef.current) {
                    messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight - messageContainerRef.current.clientHeight;
                }
                setReply('');
                console.log(response.data.message)
                // alert(response.data.message)
            } catch (error) {
                console.error(error); 
                alert(error)
            }
        }

    }



    return (
        <Box className="chat-window" >
            <Box height={'100px'} bg='gray.200' display={'flex'} alignItems={'center'} justifyContent={'space-between'} p={4} borderTopRadius="20px">
                <Heading as='h2' size='lg'>
                    Chat with {selectedContact.name}
                </Heading>
                {
                    conversationId!=='' &&
                    <VStack>
                    <Text>{conversationId}</Text>
                    <Text>{formattedExpirationDate}</Text>
                    </VStack>
                }
            </Box>
            <Box className="messageContainer" ref={messageContainerRef} height='75vh' overflowY={'scroll'}  >
                {messageList.map((message, index) => (
                    <Box key={index} className="message" borderRadius={'20px'} p={'1rem'} bg={'gray.100'} width={'60%'} my={'1rem'} ml={'1rem'} display={'flex'}
                    justifyContent={'space-between'} alignItems={'center'}>
                        <Text>{message.text} </Text>
                        <HStack>

                        {message.status &&
                        
                        <Text>
                            {message.status}
                        </Text>}
                        <Text>{format(new Date(Number(message.timestamp) * 1000), "h:mm a d MMMM")}</Text>
                        </HStack>
                    </Box>
                ))}
            </Box>
            <Box className='messageSender'>
                <InputGroup size='lg'>
                    <Input
                        pr='4.5rem'
                        type={'text'}
                        placeholder='Enter Message'
                        focusBorderColor='#92bbf1'
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                    />
                    <InputRightElement width='4.5rem'>
                        <FiSend cursor={'pointer'} size={20} onClick={sendMessage} />
                    </InputRightElement>
                </InputGroup>

            </Box>
        </Box>
    );
}

export default ChatWindow;
