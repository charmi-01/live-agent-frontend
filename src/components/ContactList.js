import React, { useEffect } from 'react';
import { ListItem, List, Heading, Box, Text } from '@chakra-ui/react';
import { getContactList } from '../features/contactSlice';
import { useSelector, useDispatch } from 'react-redux';
// import { Box } from '@chakra-ui/react/dist';
import { io } from 'socket.io-client';

const socket = io.connect("https://webhook-pbyy.onrender.com")
function ContactList({ onSelectContact }) {
  const dispatch = useDispatch()


  useEffect(() => {
    // Fetch contacts when the component mounts
    console.log(1);
    dispatch(
      getContactList()
    )
    socket.on("webhookNotificationContact", (data) => {
      dispatch(getContactList())
      console.log(2);
    })
  }, []);

  const contactList = useSelector((state) => state.contact.contactList);

  return (
    <div className="contact-list">
      <Heading as="h2" size='lg'>Contacts</Heading>
      <List spacing={4} mt={5}>
        {contactList.map(contact => (
          <ListItem key={contact._id} onClick={() => onSelectContact(contact)} cursor='pointer'>
            <Box height={'80px'} bg='gray.100' display={'flex'} alignItems={'center'} justifyContent={'space-between'} p={4} borderRadius="20px">
              <Text>
                {contact.name}
              </Text>
              <Text>
                {contact.phoneNumber}
              </Text>
            </Box>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default ContactList
