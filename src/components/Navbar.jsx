import React, { useContext, useEffect, useState } from 'react'
import { onSnapshot, doc } from 'firebase/firestore'
import { ChatContext } from '../context/ChatContext'
import { Modal, GroupChatForm, NewNotesForm } from './groupChatForm'
import UpdateEmail from './UpdateEmail'
import Settings from './Settings'
import group from '../assets/groups.svg'
import notes from '../assets/notesIcon.svg'
import settingsIcon from '../assets/settingsIcon.svg'
import messageIcon from '../assets/messageIcon.svg'
import pen from '../assets/pen.png'
import SettingsModal from './SettingsModal'
import { signOut } from 'firebase/auth'
import { auth, db } from '../firebase'
import { AuthContext } from '../context/AuthContext'
import { TabContext } from '../context/TabContext'
import '../styles.scss'


function Navbar() {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { setActiveTab } = useContext(TabContext);

  const openSettingsModal = () => setIsSettingsModalOpen(true);
  const closeSettingsModal = () => setIsSettingsModalOpen(false);


  return (
    <div className="navbar">
      <img src={pen}></img>
      <span className="nav-logo">Pen Pals</span>
      <div className='navbar-Icons'>
        <button className='navIcon' onClick={() => setActiveTab('personal')}>
          <img className='navIcon' src={messageIcon}></img>
        </button>
        <button className='navIcon' onClick={() => setActiveTab('group')}>
          <img className='navIcon' src={group}></img>
        </button>
        <button className='navIcon' onClick={() => setActiveTab('notes')}>
          <img className='navIcon' src={notes}></img>
        </button>
        <button className='navIcon' onClick={openSettingsModal}>
          <img className='navIcon' src={settingsIcon}></img>
        </button>
      </div>
      <div className="user">
        <img src={currentUser.photoURL} alt="" />
        <span> {currentUser.displayName} </span>
        <button onClick={() => signOut(auth)}>logout</button>
      </div>
      {isSettingsModalOpen && <SettingsModal onClose={closeSettingsModal} />}
    </div>
  )
}

function UserSettings() {
  const [chats, setChats] = useState([])
  const {currentUser} = useContext(AuthContext);
  const { dispatch } =  useContext(ChatContext)


  useEffect(() => {
    const getChats = () => {
    const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
      setChats(doc.data());
    });

    return () => {
      unsub()
    };
  };
    currentUser.uid && getChats();
  },[currentUser.uid])

  const handleSelect = (u) => {
    dispatch({type:"CHANGE_USER", payload: u})
  }

  console.log(Object.entries(chats))
  
  return (
    <div>
      <Settings />
    </div>
  )
}
export default Navbar