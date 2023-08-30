import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getContactList = createAsyncThunk(
  'getContactList',
  async () => {
    const res = await axios.get('https://live-agent-backend.onrender.com/api/contacts')
    return res.data
  })


const contactSlice = createSlice({
  name: "contact",
  initialState: {
    contactList:[],
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(getContactList.fulfilled, (state,action) => {
      state.contactList=action.payload
    })
  },
});

// export const { updateContact } =
//   contactSlice.actions;

export default contactSlice.reducer;
