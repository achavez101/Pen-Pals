import React, {useContext, useEffect, useState} from 'react'
import { onSnapshot, doc } from 'firebase/firestore'
import { db } from '../firebase'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import { Modal, GroupChatForm } from './groupChatForm'
import EmailVerification from './UpdateEmail'
import Settings from './Settings'
import group from '../assets/groups.svg'
import notes from '../assets/notesIcon.svg'
import settingsIcon from '../assets/settingsIcon.svg'
import messageIcon from '../assets/messageIcon.svg'
import SettingsModal from './SettingsModal'
import { NewNotesForm } from './groupChatForm'
import '../styles.scss'

function Chats() {
  const [activeTab, setActiveTab] = useState('settings');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const openSettingsModal = () => setIsSettingsModalOpen(true);
  const closeSettingsModal = () => setIsSettingsModalOpen(false);

  return(
    <div className='sidebar'>
      <div className='navbar-icons'>
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
      <div>
        {activeTab === 'personal' && <Messages />}
        {activeTab === 'group' && <Groups />}
        {activeTab === 'notes' && <Notes />}
      </div>
      {isSettingsModalOpen && <SettingsModal onClose={closeSettingsModal} />}
    </div>
  )
}

function Messages() {
  const [chats, setChats] = useState([])
  const {currentUser} = useContext(AuthContext);
  const { dispatch } =  useContext(ChatContext);


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

  console.log(chats)
  
  if(chats === undefined) {
    return ( 
    <>
      <span class="no-message">
          No messages found.
      </span>   
    </> 
    )
  } else if (Object.entries(chats).length === 0) {
    return ( 
    <>
      <span class="no-message">
        No messages found.
      </span>   
    </>
    )
  } else {
    console.log(chats)
    return (
      <div className="chats">
      {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map(chat => (
      <div className="userChat" key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>
        <img src={chat[1].userInfo.photoURL} alt="" className="userChat" />
        <div className="userChatInfo">
          <span>{chat[1].userInfo.displayName}</span>
          <p>{chat[1].lastMessage?.text.slice(0, 20)}{chat[1].lastMessage?.text.length > 20 ? '...' : ''}</p>
        </div>
      </div>
    ))}
  </div>
    )
  }
}

function Groups() {
  const [chats, setChats] = useState([])
  const {currentUser} = useContext(AuthContext);
  const { dispatch } =  useContext(ChatContext)


  useEffect(() => {
    const getChats = () => {
    const unsub = onSnapshot(doc(db, "userGroups", currentUser.uid), (doc) => {
      setChats(doc.data());
      console.log(doc.data())
    });

    return () => {
      unsub()
    };
  };
    currentUser.uid && getChats();
  },[currentUser.uid])

  const handleSelect = (u) => {
    dispatch({type:"CHANGE_GROUP", payload: u})
  }

  console.log(chats);
  const test3 = Object.entries(chats)
  console.log(test3)

  if(chats != undefined) {
    console.log(Object.entries(chats))
    const test = Object.entries(chats)
    const test2 = test[1]
    console.log(test2)
  // Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map(chat => (
  // console.log(Object.entries(chats)[1])))
  console.log(test.length)
  }

  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  

  if(chats === undefined) {
    return ( 
    <>
        <button className="new-group" onClick={openModal}>New Group</button>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <GroupChatForm onClose={closeModal} />
        </Modal> 
      <span class="no-group-chats">
        No chats found.
      </span>   
    </> 
    )
  } else if (Object.entries(chats).length === 0) {
    return(
      <>
        <button className="new-group" onClick={openModal}>New Group</button>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <GroupChatForm onClose={closeModal} />
        </Modal> 
        <span class="no-group-chats">
          No chats found.
        </span>   
      </>

    )
  } else {
    return (
      <>
        <button className="new-group" onClick={openModal}>New Group</button>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <GroupChatForm onClose={closeModal} />
        </Modal>    
        <div className="chats">
      {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map(chat => (
      <div className="userChat" key={chat[0]} onClick={() => handleSelect(chat[1].groupInfo)}>
        <img src={chat[1].groupInfo.photoURL} alt="" className="userChat" />
        <div className="userChatInfo">
          <span>{chat[1].groupInfo.groupName}</span>
          <p>{chat[1].lastMessage?.text.slice(0, 20)}{chat[1].lastMessage?.text.length > 20 ? '...' : ''}</p>
        </div>
      </div>
      ))}

    </div>
    </>
  )

  }
}

function Notes() {
  const [chats, setChats] = useState([])
  const {currentUser} = useContext(AuthContext);
  const { dispatch } =  useContext(ChatContext)


  useEffect(() => {
    const getChats = () => {
    const unsub = onSnapshot(doc(db, "userNotes", currentUser.uid), (doc) => {
      setChats(doc.data());
      console.log(doc.data())
    });

    return () => {
      unsub()
    };
  };
    currentUser.uid && getChats();
  },[currentUser.uid])

  const handleSelect = (u) => {
    dispatch({type:"CHANGE_NOTE", payload: u})
  }

  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  
  if(chats === undefined) {
    return ( 
    <>
        <button className="new-note" onClick={openModal}>New Note</button>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <NewNotesForm onClose={closeModal} />
        </Modal>    
      <span class="no-notes">
          No notes found. 
      </span>   
    </> 
    )
  } else if (Object.entries(chats).length === 0) {
    return(
      <>
        <button className="new-note" onClick={openModal}>New Note</button>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <NewNotesForm onClose={closeModal} />
        </Modal> 
        <span class="no-notes">
          No notes found.  
        </span>   
      </>

    )
  } else {
  return (
    <>        
      <button className="new-note" onClick={openModal}>New Note</button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <NewNotesForm onClose={closeModal} />
      </Modal> 
      <div className="chats">
        {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map(chat => (
        <div className="userChat" key={chat[0]} onClick={() => handleSelect(chat[1].noteInfo)}>
          <img src={chat[1].noteInfo.photoURL} alt="" className="userChat" />
          <div className="userChatInfo">
            <span>{chat[1].noteInfo.noteName}</span>
            <p>{chat[1].lastMessage?.text.slice(0, 20)}{chat[1].lastMessage?.text.length > 20 ? '...' : ''}</p>
          </div>
        </div>
        ))}
      </div>
    </>
  )
  }
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


export default Chats