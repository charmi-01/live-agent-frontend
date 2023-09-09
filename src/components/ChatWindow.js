import React, { useEffect, useState, useRef } from 'react';
import { Heading, Box, InputGroup, Input, InputRightElement, Text, HStack, VStack, Spinner } from '@chakra-ui/react';
import { FiSend } from "react-icons/fi"
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { getMessageList, updateMessageList } from '../features/messageSlice';
import axios from 'axios';
import { format } from 'date-fns';

const socket = io.connect("https://webhook-pbyy.onrender.com")


function ChatWindow({ selectedContact }) {
    const [reply, setReply] = useState('')
    const dispatch = useDispatch()
    const messageContainerRef = useRef();

    const scrollToBottom = () => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, []);


    useEffect(() => {
        dispatch(
            getMessageList(selectedContact.phoneNumber)
        )
        
    }, [selectedContact, dispatch]);

    useEffect(()=>{
        socket.on("webhookNotificationMessageRecieved", (data) => {
            dispatch(updateMessageList(data))
        })
    },[dispatch])


    const isLoading = useSelector((state) => state.message.isLoading)
    const messageList = useSelector((state) => state.message.messageList);
    const conversationId = useSelector((state) => state.message.conversationId);
    const expirationTime = useSelector((state) => state.message.expirationTime);

    const expirationDate = new Date(Number(expirationTime) * 1000);
    const formattedExpirationDate = expirationDate.toLocaleString(); // Adjust this as per your preference

    useEffect(() => {
        scrollToBottom(); 
    }, [messageList]);


    const sendMessage = async () => {
        if (reply.trim() !== '') {
            try {
                const response = await axios.post('https://live-agent-backend.onrender.com/api/messages/send', {
                    to: selectedContact.phoneNumber,
                    content: reply,
                });
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
                    conversationId !== '' &&
                    <VStack>
                        <Text>{conversationId}</Text>
                        <Text>{formattedExpirationDate}</Text>
                    </VStack>
                }
            </Box>
            {isLoading ?
                <Box height='75vh' w={"100%"} position={'relative'}>
                    <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='xl'
                        position='absolute'
                        top='50%'
                        left='50%'
                        transform='translate(-50%, -50%)'
                    />
                </Box>
                :
                <Box className="messageContainer" ref={messageContainerRef} height='75vh' w={"100%"} overflowY={'scroll'} position={'relative'}  >
                    {
                        messageList.map((message, index) => (
                            <Box key={index} width={'100%'}>
                            <Box  className="message" borderRadius={'20px'} p={'1rem'} bg={'gray.100'} width={'50%'} my={'1rem'} ml={message.status?'49%':'1rem'}   display={'flex'}
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
                            </Box>
                        ))
                    }
                </Box>
            }
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
