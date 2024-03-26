import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
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

    const unSub = onSnapshot(doc(db, collectionName, data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
      console.log(messages)
    });

    return () => {
      unSub();
    };
  }, [data.chatId, data.chatType]);

  console.log(messages)

  return (
    <div className="messages">
      {[...messages].reverse().map((m) => (
        <Message messages={messages} message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;