import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Attach from "../assets/paper-clip.png";

function Input() {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [messages, setMessages] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [collectionName, setCollectionName] = useState('chats');

  useEffect(() => {
    if (data.chatType === 'group') {
        setCollectionName('groupChats');
    } else if (data.chatType === 'chat') {
        setCollectionName('chats');
    } else if (data.chatType === 'note') {
        setCollectionName('notes');
    } else {
        // Handle unexpected chatType
        console.error('Unknown chatType:', data.chatType);
    }
    console.log(collectionName)
  }, [data.chatType]);


  const handleSend = async () => {
    const messageData = {
      id: uuid(),
      text,
      senderId: currentUser.uid,
      date: Timestamp.now(),
    };

    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        'state_changed',
        null,
        (err) => console.error(err),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          messageData.img = downloadURL;
          await sendMessage(messageData);
        }
      );
    } else {
      await sendMessage(messageData)
    }
  };

  useEffect(() => {
    let unSub;

    if (data && data.chatId) {
        unSub = onSnapshot(doc(db, collectionName, data.chatId), (doc) => {
            doc.exists() && setMessages(doc.data().messages);
        });
    }

    return () => {
      // Clean up the subscription
      if (unSub) unSub();
    };
}, [data, collectionName]); // Include collectionName in the dependency array

  //   const unSub = onSnapshot(doc(db, collectionName, data.chatId), (doc) => {
  //     doc.exists() && setMessages(doc.data().messages);
  //   });

  //   return () => {
  //     unSub();
  //   };
  // }, [collectionName]);


  const sendMessage = async (messageData) => {
    const newMessagesArray = [messageData, ...messages]
    await updateDoc(doc(db, collectionName, data.chatId), {
      // messages: arrayUnion(messageData),
      messages: newMessagesArray,
    });

    if(collectionName === 'chats'){
      console.log('chats searching');
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".lastMessage"] : { text },
        [data.chatId + ".date"]: serverTimestamp(),
      });
      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".lastMessage"] : { text },
        [data.chatId + ".date"]: serverTimestamp(),
      });
      console.log('chats updated');
    } else if(collectionName === 'groupChats'){
      const users = data.groupInfo.users;

      console.log(users);
      console.log('groups searching');
      users.forEach((user) => 
      updateDoc(doc(db, "userGroups", user), {
        [data.chatId + ".lastMessage"] : { text },
        [data.chatId + ".date"]: serverTimestamp(),
      })
      );
      console.log('groups updated');
    }else if(collectionName === 'notes'){
      console.log('notes searching');
      await updateDoc(doc(db, 'userNotes', currentUser.uid), {
        [data.chatId + '.lastMessage'] : {text},
        [data.chatId + '.date'] : serverTimestamp(),
      })
      console.log('notes updated');
    }

    setText("");
    setImg(null);
  };

  const  handleFile = (e) => {
    console.log(e.target.files)
    const img = e.target.files[0]
    setImg(img)
  }

  const deleteSendingPhoto = () =>{
    setImg(null)
  }

  return (
    <div className="chat-input">
      {img ? 
      <div className="sending-photo-container">
        <img src={URL.createObjectURL(img)} alt="" className="sending-image" /> 
        <button onClick={deleteSendingPhoto} className="delete-sending-photo">x</button>
      </div>
      
      : 
      null}
    <input
      type="text"
      placeholder="type a message...."
      onChange={(e) => setText(e.target.value)}
      value={text}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault(); // Prevents the default action of the enter key
          handleSend();
        }    
      }}
    />
    <div className="send">
      <input
        type="file"
        style={{ display: "none" }}
        id="file"
        onChange={handleFile}
        placeholder="hello"
      />
      <label htmlFor="file">
        <img src={Attach} alt=""/>
      </label>
      <button onClick={handleSend}>Send</button>
    </div>
  </div>
  )
}

export default Input;
