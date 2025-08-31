import React, { use } from 'react'
import { useChatStore } from '../store/useChatStore'
import SidebarSkeleton from '../skeletons/SidebarSkeleton'
import { Users, Search } from 'lucide-react'
import { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'

const Sidebar = () => {
  const {getUsers, users, selectedUser, setSelectedUser, isUsersLoading} = useChatStore()
  
  const {onlineUsers} = useAuthStore(); 

useEffect(() => {
  getUsers();
}, []);

if (isUsersLoading) return <SidebarSkeleton />

  return (
    <aside className='h-full w-80 bg-white border-r border-gray-200 flex flex-col'>
      {/* Header */}
      <div className='p-6 border-b border-gray-200'>
        <h1 className='text-2xl font-bold text-red-900 text-center mb-4'>MESSAGES</h1>
        
        {/* Search Bar */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
          <input
            type='text'
            placeholder='Search'
            className='w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300'
          />
        </div>
      </div>

      {/* Contact List */}
      <div className='flex-1 overflow-y-auto'>
        {users.length === 0 ? (
          <div className='p-6 text-center text-gray-500'>
            <Users className='w-12 h-12 mx-auto mb-3 text-gray-300' />
            <p className='text-sm'>No contacts found</p>
          </div>
        ) : (
          users.map((user) => (
            <button 
              key={user._id} 
              onClick={() => setSelectedUser(user)} 
              className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors duration-150 ${
                selectedUser?._id === user._id ? 'bg-red-50 border-r-2 border-red-900' : ''
              }`}
            >
              {/* Avatar */}
              <div className='relative flex-shrink-0'>
                <div className='w-12 h-12 rounded-full flex items-center justify-center'>
                  {user.image ? (
                    <img 
                      src={user.image} 
                      alt={user.name} 
                      className='w-full h-full rounded-full object-cover'
                    />
                  ) : (
                    <img 
                      src="/user-stud.png" 
                      alt={user.name} 
                      className='w-full h-full rounded-full object-cover'
                    />
                  )}
                </div>
                
                {/* Online/Offline Status - Only show green dot when online */}
                {onlineUsers.includes(String(user._id)) && (
                  <div className='absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-green-500'></div>
                )}
              </div>

              {/* User Info */}
              <div className='flex-1 text-left min-w-0'>
                <div className='font-medium text-gray-900 truncate'>{user.name || 'Unknown User'}</div>
                <div className={`text-sm text-gray-500 ${onlineUsers.includes(String(user._id)) ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                  {onlineUsers.includes(String(user._id)) ? 'Online' : 'Offline'}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  )
}

export default Sidebar