import React, { useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import { useEffect } from 'react'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import MessageSkeleton from './MessageSkeleton'
import { useAuthStore } from '../store/useAuthStore'

const ChatContainer = () => {
  const {messages, getMessages, isMessagesLoading, selectedUser, subscribeToNewMessage, unsubscribeFromNewMessage} = useChatStore();
  const { authUser } = useAuthStore();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    
    // Call getMessages if we have a valid selectedUser with a valid _id (can be string or number)
    if (selectedUser && selectedUser._id && (typeof selectedUser._id === 'string' || typeof selectedUser._id === 'number')) {
      console.log('Fetching messages for user:', selectedUser._id);
      getMessages(selectedUser._id);
      subscribeToNewMessage();
      return () => unsubscribeFromNewMessage();
    } else {
      console.log('Invalid selectedUser or _id, not fetching messages:', selectedUser);
    }
  }, [selectedUser, getMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages])
  
  if(isMessagesLoading){
    return (
      <div className='chat-container'>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    )
  } 

  return (
    <>
      {/*
        
        <div className='flex flex-col h-full bg-white'>
          <ChatHeader />
          <div className='chat-messages'>
            {messages.map((message) => (
              <div key={message.messageID} 
                   className={'chat-' + (message.counselorID === authUser?.counselorID ? 'end' : 'start')}>
                
                <div className='chat-image avatar'>
                  <div className='w-10 rounded-full'>
                    <img src={
                      message.counselorID === authUser?.counselorID 
                        ? authUser?.image || '/user-stud.png' 
                        : selectedUser?.image || '/user-stud.png'
                    } alt='user' />
                  </div>
                </div>

                <div className='chat-header mb-1'>
                  <time className='text-xs opacity-50'>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </time> 
                </div>
                
                <div className='chat-bubble'>{message.text}</div>
              </div>
            ))}
          </div>
          
          <MessageInput />
        </div>
          */}
        
      <div className="chat-container">
        <ChatHeader />

        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.map((message, index) => {
            const isFromCurrentUser = message.counselorID === authUser?.counselorId;
            
            return (
              <div key={`${message.messageID || index}-${message.timestamp}`} className={`chat ${isFromCurrentUser ? 'chat-end' : 'chat-start'}`}>
                <div className='chat-image avatar'>
                  <div className='w-10 rounded-full'>
                    <img src={isFromCurrentUser ? (authUser?.image || '/counsel-prof.png') : (selectedUser?.image || '/user-stud.png')} alt='user' />
                  </div>
                </div>
                      
                <div className='chat-header mb-1'>
                  <span className='text-xs opacity-50'>{new Date(message.timestamp).toLocaleDateString()}</span>
                  <span className='text-xs opacity-50'>{new Date(message.timestamp).toLocaleTimeString()}</span> 
                </div>
                
                <div className='chat-bubble'>{message.text}</div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className='border-t border-gray-200 p-1 bg-white'>
          <MessageInput />
        </div>
      </div>
    </>
  )
}

export default ChatContainer