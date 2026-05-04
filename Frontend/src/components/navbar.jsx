import React, { useState } from 'react';
import UserConfigModal from './UserConfigModal';
import { api } from '../services/api';
import Swal from 'sweetalert2';


function Navbar({ userData, logout_handler }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUsersData, setCurrentUsersData] = useState(userData);

  const handleSaveConfig = async (newData) => {
    try {
      const response = await api.updateUser(currentUsersData.user_id, newData);
      if (response.success) {
        const updatedUser = { 
          ...currentUsersData, 
          ...newData,
          name: newData.username || currentUsersData.name,
          img: newData.image || currentUsersData.img
        };
        setCurrentUsersData(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        Swal.fire('Success', 'Profile updated successfully', 'success');
      } else {
        Swal.fire('Error', response.message || 'Could not update profile', 'error');
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire('Error', 'Network error', 'error');
    }
  };


  return (
    <div className="flex h-screen flex-col md:flex-row">
      <div className="bg-violet-800 text-white p-4 flex justify-between items-center md:hidden">
        <h1 className="font-bold"></h1>
        <button onClick={() => setIsOpen(!isOpen)} className="text-2xl focus:outline-none">
          <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>
      </div>

      <nav className={`
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 fixed md:static z-40
        flex flex-col bg-violet-800 h-full w-64 md:w-48 
        rounded-r-2xl items-center justify-around
        transition-transform duration-300 ease-in-out
      `}>

        <div className="flex flex-col items-center justify-center mt-8 md:mt-0">
          <img
            src={currentUsersData.image || currentUsersData.img || 'perfil.png'}
            className="w-20 h-20 md:w-40 md:h-40 bg-black text-white mb-2 rounded-full 
                        object-cover border-3 border-violet-900 select-none pointer-events-none cursor-pointer hover:opacity-90 transition-opacity"
            alt="user photo"
            onClick={() => setIsModalOpen(true)}
          />
          <h1 className="text-violet-100 font-bold text-2xl font-mono text-center px-2 select-none cursor-pointer" onClick={() => setIsModalOpen(true)}>{currentUsersData.username || currentUsersData.name}</h1>

        </div>

        <div className="hidden md:block h-0.5 w-32 bg-violet-900 rounded-xl"></div>

        <ol className="text-white text-xl flex flex-col items-center space-y-6 md:space-y-4 select-none">
          <li><a className="hover:text-2xl text-xl font-semibold font-mono transition-all" href="/admin-panel">Home</a></li>
          <li><a className="hover:text-2xl font-semibold font-mono transition-all" href="/travels">Travels</a></li>
          <li><a className="hover:text-2xl font-semibold font-mono transition-all" href="/travellers">Travellers</a></li>
          {(currentUsersData.role === 'admin' || currentUsersData.role === 'Administrator') && (
            <li><a className="hover:text-2xl font-semibold font-mono transition-all" href="/users">Users</a></li>
          )}
          <li><a className="hover:text-2xl font-semibold font-mono transition-all" href="/statistics">Statistics</a></li>

        </ol>


        <div className="hidden md:block h-0.5 w-32 bg-violet-900 rounded-xl"></div>

        <button
          onClick={logout_handler}
          className="mb-8 md:mb-0 text-white text-lg font-semibold hover:scale-110 
          transition-transform flex items-center select-none"
        >
          <i className="fa-solid fa-arrow-right-from-bracket mr-4"></i>
          Log-Out
        </button>
      </nav>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <UserConfigModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userData={currentUsersData}
        onSave={handleSaveConfig}
      />
    </div>

  );
};

export default Navbar;