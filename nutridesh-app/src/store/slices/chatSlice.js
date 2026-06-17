import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [
    {
      _id: 'init',
      text: 'নমস্কার! আমি পুষ্টি সহায়ক। আপনার খাবার ও পুষ্টি নিয়ে যেকোনো প্রশ্ন জিজ্ঞেস করুন। 🌿',
      createdAt: new Date(Date.now() - 60000),
      user: { _id: 2, name: 'পুষ্টি সহায়ক' },
    },
  ],
  isTyping: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage(state, action) {
      state.messages.unshift(action.payload);
    },
    setTyping(state, action) {
      state.isTyping = action.payload;
    },
    clearMessages(state) {
      state.messages = initialState.messages;
    },
    replaceState(state, action) {
      Object.assign(state, action.payload || {});
    },
  },
});

export const { addMessage, setTyping, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
