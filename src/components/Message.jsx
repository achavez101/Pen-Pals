import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import { collection, getDocs } from 'firebase/firestore'
import { db } from "../firebase";
import { Modal, EditMessage } from './editMessage';


function Message({message, messages}) {
  const {currentUser} = useContext(AuthContext)
  const {data} = useContext(ChatContext)
  const date = new Date()
  const [msgSender, setMsgSender] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs.map(doc => doc.data());
        console.log(usersData);
        const sender = usersData.filter(user => user.uid === message.senderId)
        console.log(sender[0].uid)
        setMsgSender(sender[0]);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  
const ref = useRef();
console.log(message.date)

console.log(msgSender)
// const senderImg = 

useEffect(() => {
  ref.current?.scrollIntoView({behavior: "smooth"});
}, [message])


    return (
      <div ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={ msgSender.photoURL }
          alt=""
        />
        <span>{message.date.toDate().toLocaleTimeString()}</span>
      </div>
      <div className="messageContent">
        {message.text !== "" ? <p>{message.text}</p> : null}
        {message.img && <img src={message.img} alt="" />}
      </div>
      <button onClick={openModal} className="delete-message">Edit</button>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <EditMessage onClose={closeModal} msg={message} msgs={messages}/>
        </Modal> 
    </div>
    )
}

export default Message