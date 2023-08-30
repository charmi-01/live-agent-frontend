import React, {  useState } from 'react';
// import './App.css'; // You can style your components using CSS
import ContactList from './components/ContactList';
import ChatWindow from './components/ChatWindow';
import { Grid, GridItem, Box } from '@chakra-ui/react';


function App() {
  const [selectedContact, setSelectedContact] = useState(null);
  return (
    <div className="app">
      <Grid templateColumns='repeat(6, 1fr)'>
        <GridItem colSpan={2}>
        <Box p={4}>
          <ContactList
            onSelectContact={contact => setSelectedContact(contact)}
          />
        </Box>
        </GridItem>
        <GridItem colSpan={4}>
        <Box p={4}>
          {selectedContact && (
            <ChatWindow selectedContact={selectedContact} />
          )}
        </Box>
        </GridItem>
      </Grid>
    </div>
  );
}

export default App;
