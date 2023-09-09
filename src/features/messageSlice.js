import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getMessageList = createAsyncThunk(
  'getMessageList',
  async (phoneNumber) => {

    const res = await axios.get('https://live-agent-backend.onrender.com/api/messages/' + phoneNumber)
    return res.data
  })


const messageSlice = createSlice({
  name: "message",
  initialState: {
    messageList: [],
    conversationId: '',
    expirationTime: '',
    isLoading: false
  },
  reducers: {
    updateMessageList: (state, action) => {
      // Append the message data to the existing messageList
      state.messageList = [...state.messageList, ...action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMessageList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMessageList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messageList = action.payload
        // Find the last message with conversationId
        const lastMessageWithConversation = action.payload
          .slice()
          .reverse()
          .find(message => message.conversationId);

        if (lastMessageWithConversation) {
          state.conversationId = lastMessageWithConversation.conversationId;
          state.expirationTime = lastMessageWithConversation.expirationTimestamp;
        } else {
          state.conversationId = ''
          state.expirationTime = ''
        }
      })

  },
});

export const { updateMessageList } = messageSlice.actions;

export default messageSlice.reducer;
