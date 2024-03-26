import React, { useContext, useEffect, useState } from 'react';
import { 
    addDoc, 
    collection, 
    doc,
    getDocs, 
    getDoc, 
    serverTimestamp, 
    setDoc, 
    updateDoc,
    where,
    query
} from 'firebase/firestore';
import { db, storage } from '../firebase'
import { AuthContext } from '../context/AuthContext';
import upload from "../assets/gallery.png"
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

export const NewNotesForm = ({ onClose }) => {
  const [noteName, setNoteName] = useState('');
  const { currentUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (noteName === '') {
      alert('Please enter a note name.');
      return;
    }

    try {
        const res = await getDoc(doc(db, 'notes', currentUser.uid + noteName));
        console.log(res.data)
        if (!res.exists()) {
          // create a chat in group chats collection
            await setDoc(doc(db, 'notes', currentUser.uid + noteName), {messages: []});

              updateDoc(doc(db, 'userNotes', currentUser.uid),  {
                [currentUser.uid + noteName + '.noteInfo']: {
                  noteId: currentUser.uid + noteName,
                  noteName: noteName,
                  photoURL: currentUser.photoURL
                },
                [currentUser.uid + noteName + '.date']: serverTimestamp(),
              });
            }
        } catch (error) {
      console.error("Error creating group chat: ", error);
    }
    onClose();
  };


  return (
    <form onSubmit={handleSubmit}>
      <label>
        Note Name:
        <input
          type="text"
          value={noteName}
          onChange={(e) => setNoteName(e.target.value)}
        />
      </label>
      <button type="submit">Create Note</button>
    </form>
  );

}


export const GroupChatForm = ({ onClose }) => {
  const [chatName, setChatName] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [addedUsers, setAddedUsers] = useState([]);
  const [addedUserObjects, setAddedUserObjects] = useState([]);
  const [groupPhotoURL, setGroupPhotoURL] = useState([]);
  const[fileName, setFileName] = useState(null)
  const { currentUser } = useContext(AuthContext);

  console.log(currentUser)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs.map(doc => doc.data());
        console.log(usersData);
        setAllUsers(usersData);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (chatName === '') {
      alert('Please enter a group name.');
      return;
    }

    if (fileName === null) {
      alert('Please enter a group photo')
      return;
    }

    let photoURL = null
    if (groupPhotoURL) {
      const storageRef = ref(storage, `groupPhots/${groupPhotoURL.name}`);
      try {
        const snapshot = await uploadBytes(storageRef, groupPhotoURL);
        photoURL = await getDownloadURL(snapshot.ref);

      } catch (err) {
        console.error('Error uploading file: ', err);
        return;
      }
    }

    const allChatUsers = allUsers.filter(user => user.displayName === currentUser.displayName);
    addedUserObjects.forEach(user => {
      allChatUsers.push(user);
    })

    console.log(allChatUsers);

    console.log(addedUsers)
    const groupChatId = [currentUser.uid, ...addedUserObjects.map((u) => u.uid)].sort().join('_');
    const userIds = [currentUser.uid, ...addedUserObjects.map((u) => u.uid)].sort();
    console.log(groupChatId)



    try {
        const res = await getDoc(doc(db, 'groupChats', groupChatId));
        console.log(res.data)
        if (!res.exists()) {
          // create a chat in group chats collection
            await setDoc(doc(db, 'groupChats', groupChatId), {messages: []});

            
            allChatUsers.forEach(user => {
              console.log(user)
              updateDoc(doc(db, 'userGroups', user.uid),  {
                [groupChatId + '.groupInfo']: {
                  // members: addedUserObjects.map((u) => ({ uid: u.uid, displayName: u.displayName, photoURL: u.photoURL})),
                  groupId: groupChatId,
                  groupName: chatName,
                  photoURL: photoURL,
                  users: userIds
                },
                [groupChatId + '.date']: serverTimestamp(),
              });
            });
            }
        } catch (error) {
      console.error("Error creating group chat: ", error);
    }
    onClose();
  };
  
  const addUserToChat = (user) => {
    if (!addedUsers.includes(user)) {
        setAddedUsers([...addedUsers, user]);
    }
    console.log(addedUsers)
  };

  const addUserObjectToChat = (user) => {
    const isUserAdded = addedUserObjects.some(addedUser => addedUser.uid === user.uid);

    if (!isUserAdded) {
        setAddedUserObjects([...addedUserObjects, user]);
    }
  }

  const removeUserObjectFromChat = user => {
    setAddedUserObjects(addedUserObjects.filter(u => u !== user))
  }

  const removeUserFromChat = (user) => {
    setAddedUsers(addedUsers.filter(u => u !== user));
  };

  const  displayFileName = (e) => {
    const name = e.target.files[0].name
    const photoURL = e.target.files[0]
    setFileName(name)
    setGroupPhotoURL(photoURL)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Chat Name:
        <input
          type="text"
          value={chatName}
          onChange={(e) => setChatName(e.target.value)}
        />
      </label>

      <input className="input-form" style={{display:"none"}} type="file" id="file" onChange={displayFileName}/>
      <label htmlFor="file">
        <img src={upload} alt="upload-icon" className="avatar-upload-icon"/><span className="add-picture">{fileName ? fileName : "select a user photo"}</span>
      </label>


      <div className='user-selection'>
        <div className="all-users">
            <h4>All Users</h4>
            {allUsers.filter(user => user.displayName !== currentUser.displayName).map(user => (
                <div key={user.uid} 
                onClick={() => {addUserToChat(user.displayName);
                addUserObjectToChat(user)}
                } className='group-form-user'>
                  <img src={user.photoURL} alt="" className="userChatSmall" />
                  {user.displayName}
                  </div>
            ))}
        </div>


        <div className="addedUsers">
            <h4>Added Users</h4>
            {addedUsers.filter(user => user.displayName !== currentUser.displayName).map(user =>
                <div key={user} onClick={() => {removeUserFromChat(user);
                removeUserObjectFromChat(user)}
                }>{user}</div>)}
        </div>
      </div>
      <button type="submit">Create Group</button>
    </form>
  );
};