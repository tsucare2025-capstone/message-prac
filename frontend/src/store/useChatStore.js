import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";
import { useAuthStore } from "./useAuthStore";


export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const response = await axiosInstance.get("/messages/users");
            set({ users: response.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch users");
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const response = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: response.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch messages");
        } finally {
            set({ isMessagesLoading: false });
        }

    },

    sendMessage: async (message) => {
        const {selectedUser, messages} = get();
        try{
            const response = await axiosInstance.post(`/messages/${selectedUser._id}`, {message});
            set({ messages: [...messages, response.data] });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send message");
        }

    },

    subscribeToNewMessage: () => {
        const {selectedUser} = get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        
        socket.on("newMessage", (newMessage) => {
        // Check if this message is for the currently selected user
        const isMessageFromSelectedUser = newMessage.counselorID === selectedUser._id || newMessage.studentID === selectedUser._id;            
        if(!isMessageFromSelectedUser) return;
            set(state => ({
                messages: [...state.messages, newMessage]
            }));
        });
    },

    unsubscribeFromNewMessage: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    },

    
    setSelectedUser: (user) => set({ selectedUser: user }),
}))