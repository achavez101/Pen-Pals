import React, { useContext } from 'react'
import online from "../assets/full-stop.png"
import Messages from './Messages'
import Input from './Input'
import { ChatContext } from '../context/ChatContext'

function Chat() {
  const { data } = useContext(ChatContext);

  let chatTitle = data.user.displayName;

    if (data.chatType === 'group') {
        chatTitle = data.groupInfo.groupName;
    } else if (data.chatType === 'chat') {
        chatTitle = data.user.displayName;
    } else if (data.chatType === 'note') {
        chatTitle = data.noteInfo.noteName;
    } else {
        // Handle unexpected chatType
        console.error('Unknown chatType:', data.chatType);
    }

  let chatImage =  data.user.photoURL;

  if (data.chatType === 'group') {
    chatImage = data.groupInfo.photoURL;
  } else if (data.chatType === 'chat') {
    chatImage = data.user.photoURL;
  } else if (data.chatType === 'note') {
    chatImage = data.noteInfo.photoURL;
  } else {
    // Handle unexpected chatType
    console.error('Unknown chatType:', data.chatType);
  }


  // const chatTitle = data.isGroupChat ? data.groupInfo.groupName : data.user.displayName;
  // const chatImage = data.isGroupChat ? data.groupInfo.photoURL : data.user.photoURL;

  return (
    <div className="chat">
        <div className="chatInfo">
        <img src={chatImage} alt="" className="userChat"/>
          <div className="userStatus">
            <span>{chatTitle}</span>
            {data.chatType === 'chat' && (
              <span className='onlineStatus'>Online <img className='online-icon' src={online}/></span>
            )}
          </div>
        </div>
        <hr />
      <Messages />
      <hr />
      <Input />
    </div>
  )
}

export default Chat