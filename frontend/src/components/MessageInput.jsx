import { useState } from 'react';
import { SendIcon } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import { toast } from 'react-hot-toast';

const MessageInput = () => {
  const [text, setText] = useState("");
  const {sendMessage} = useChatStore();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if(!text.trim()) return;
    try{
      await sendMessage(text);
      setText("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  }

  return (
    <form onSubmit={handleSendMessage} className="flex flex-col p-4">
    <div className="flex items-center gap-2 w-full">
      <input 
        type="text"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 p-2 border border-gray-300 rounded-3xl resize-none focus:outline-none focus:ring-1 focus:ring-gray-300"
      />
      
      <button 
        type="submit"
        className="btn btn-sm btn-circle"
        disabled={!text.trim()}
      >
        <SendIcon className="w-4 h-4 text-red-900" />
      </button>
    </div>
  </form>
  )
}

export default MessageInput