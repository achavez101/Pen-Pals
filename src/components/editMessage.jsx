import React, { useContext, useEffect, useState } from 'react';
import { 
    addDoc, 
    collection, 
    doc,
    getDocs, 
    getDoc, 
    onSnapshot,
    serverTimestamp, 
    setDoc, 
    updateDoc,
    where,
    query
} from 'firebase/firestore';
import { db, storage } from '../firebase'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import Messages from './Messages';

export const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button onClick={onClose} className="close-button">X</button>
        {children}
      </div>
    </div>
  );
};

export const EditMessage = ({ onClose, msg, msgs }) => {
    const { currentUser } = useContext(AuthContext);
    const {data} = useContext(ChatContext);
    // const messages = msgs
    const [messages, setMessages] = useState([]);
    const message = msg;
    const [newMessage, setNewMessage] = useState();
    const [updatedMessages, setUpdatedMessages] = useState();
    const [messagesPostDelete, setMessagesPostDelete] = useState([]);
    console.log(msg)
    const [msgText, setMsgText] = useState(msg.text)
    // const msgText = msg.text
    let collectionName = 'chat';

    if (data.chatType === 'group') {
        collectionName = 'groupChats';
    } else if (data.chatType === 'chat') {
        collectionName = 'chats';
    } else if (data.chatType === 'note') {
        collectionName = 'notes';
    } else {
        // Handle unexpected chatType
        console.error('Unknown chatType:', data.chatType);
    }
            
    useEffect(() => {
      const unSub = onSnapshot(doc(db, collectionName, data.chatId), (doc) => {
        doc.exists() && setMessages(doc.data().messages);
      });
  
      return () => {
        unSub();
      };
    }, [data.chatId, collectionName]);
  
    useEffect(() => {
      setMessagesPostDelete((messages).filter(msg => msg.id != message.id))
    }, [messages, message.id])

    const updateLastMessageEdit = async () => {

      const newMessages = messages.map(m => {
        if (m.id === message.id) {
          return { ...m, text: msgText };
        }
        return m;
      });

      const lastMessage = newMessages[0].text;
      console.log(lastMessage)

      if(collectionName === 'chats') {
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [data.chatId + ".lastMessage"] : { text: lastMessage },
        });
        await updateDoc(doc(db, "userChats", data.user.uid), {
          [data.chatId + ".lastMessage"] : { text: lastMessage },
        });
      } else if(collectionName === 'groupChats') {
        const users = data.groupInfo.users;
  
        console.log(users);
        users.forEach((user) => 
        updateDoc(doc(db, "userGroups", user), {
          [data.chatId + ".lastMessage"] : { text: lastMessage },
        })
        );
      } else if(collectionName === 'notes') {
        updateDoc(doc(db, 'userNotes', currentUser.uid), {
          [data.chatId + '.lastMessage'] : { text: lastMessage}
        })
      }
    }


    const updateLastMessageDelete = async () => {

      const lastMessage = messagesPostDelete[0].text;
      console.log(lastMessage)

      if(collectionName === 'chats') {
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [data.chatId + ".lastMessage"] : { text: lastMessage },
        });
        await updateDoc(doc(db, "userChats", data.user.uid), {
          [data.chatId + ".lastMessage"] : { text: lastMessage },
        });
      } else if(collectionName === 'groupChats') {
        const users = data.groupInfo.users;
  
        console.log(users);
        users.forEach((user) => 
        updateDoc(doc(db, "userGroups", user), {
          [data.chatId + ".lastMessage"] : { text: lastMessage },
        })
        );
      } else if(collectionName === 'notes') {
        updateDoc(doc(db, 'userNotes', currentUser.uid), {
          [data.chatId + '.lastMessage'] : { text: lastMessage}
        })
      }
    }


   
    const handleDelete = async () => {

      
      const confirmDelete = window.confirm('Are you sure you want to delete the following message: ' + message.text)
      
      if (confirmDelete) {
        updateLastMessageDelete();
        // updateMessages();
        updateDoc(doc(db, collectionName, data.chatId), { messages: messagesPostDelete}).then(() => {
            console.log('Message successfully deleted!');
        }).catch((err) => {
            console.log('Error deleting message: ', err);
        });        
      } else {
        console.log('Message delete cancelled.')
      }

    }
    

    const handleUpdate = async () => {

      updateLastMessageEdit();
      
      const newMessages = messages.map(m => {
        if (m.id === message.id) {
          return { ...m, text: msgText };
        }
        return m;
      });

      console.log(newMessages[0].text)
      
      console.log(msgText)
      console.log(updatedMessages)
      try {
        await updateDoc(doc(db, collectionName, data.chatId), {messages: newMessages});
        console.log('Message successfully updated!');
        onClose();
      } catch (err) {
        console.error('Error updating message: ', err)
      }

    }

    // setMessageComponents();
    // console.log(messages)

    return (
      <div >
        <label>
          Message text:
          <input
            type="text"
            value={msgText}
            onChange={(e) => {setMsgText(e.target.value)}}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); // Prevents the default action of the enter key
                handleUpdate();
              }    
            }}
          />
        </label>
        <button onClick={handleDelete}>Delete Message</button>
        <button onClick={handleUpdate}>Update Message</button>
      </div>
    );
  
  }
  