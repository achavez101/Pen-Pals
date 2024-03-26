import React, { useState } from 'react';
import { updateProfile, getAuth, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth, storage, db } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from 'react-router-dom';
import upload from "../assets/gallery.png";

function UpdateProfile() {
 const [error, setError] = useState(false);
 const navigate = useNavigate();
 const [fileName, setFileName] = useState(null);

 const handleSubmit = async (event) => {
    event.preventDefault();
    const displayName = event.target[0].value;
    const file = event.target[1].files[0];
    const currentPassword = event.target[2].value;
    const auth = getAuth();
    const user = auth.currentUser;

    // Reauthenticate the user with their current password
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential).catch((error) => {
      setError(error.message);
      return;
    });

    try {
      if (file) {
        const storageRef = ref(storage, `user-profiles/${user.uid}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
          (snapshot) => {
            // You can track the progress here if needed
          },
          (error) => {
            // Handle unsuccessful uploads
            setError(error.message);
          },
          () => {
            // Upload completed successfully, get download URL and update profile
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              await setDoc(doc(db, "users", user.uid), {
                photoURL: downloadURL
              }, { merge: true });
              // Update profile with new photo URL
              await updateProfile(user, {
                photoURL: downloadURL
              });
              navigate("/");
            });
          }
        );
      }

      if (displayName) {
        // Update profile with new display name
        await updateProfile(user, {
          displayName
        })
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    }
 };

 const displayFileName = (e) => {
    const name = e.target.files[0].name;
    setFileName(name);
 };

 return (
    <div className="settings-form-container">
      <div className="form-wrapper">
        <form onSubmit={handleSubmit}>
          <h2>Update Profile</h2>
          <input className="input-form" type="text" placeholder="username" />
          <input className="input-form" style={{ display: "none" }} type="file" id="file" onChange={displayFileName} />
          <label htmlFor="file">
            <img src={upload} alt="upload-icon" className="avatar-upload-icon" /><span className="add-picture">{fileName ? fileName : "select a user photo"}</span>
          </label>
          <input className='input-form' type='password' placeholder='password' />
          <button className="update-button">Update Profile</button>
          {error && <span>{error}</span>}
        </form>
      </div>
    </div>
 );
}

export default UpdateProfile;
