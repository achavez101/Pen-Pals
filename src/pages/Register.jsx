import React, { useState } from 'react'
import loginPhoto from "../assets/login-photo.png"
import pen from "../assets/pen.png"
import upload from "../assets/gallery.png"
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile} from "firebase/auth";
import { auth, storage, db } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from 'react-router-dom';
import { BeatLoader } from "react-spinners"; // Import from react-spinners that in npm Installed

function Register() {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const[fileName, setFileName] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault();
    const displayName = event.target[0].value;
    const email = event.target[1].value;
    const password = event.target[2].value;
    const confirmPassword = event.target[3].value;
    const file = event.target[4].files[0];

    if (!file) {
      return alert('Please enter a photo');
    }

    if (password !== confirmPassword) {
      return alert('Passwords do not match');
    }

    try {
      setLoading(true); // Set loading to true when starting 
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(res.user);
      const storageRef = ref(storage, displayName);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef)
          .then(async (downloadURL) => {
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL
            });

            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL
            });

            await setDoc(doc(db, "userChats", res.user.uid), {});
            await setDoc(doc(db, "userGroups", res.user.uid), {});
            await setDoc(doc(db, "userNotes", res.user.uid), {});
            navigate("/Login");
          });
      });
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="form-container">
      <img src={loginPhoto} className='login-photo' />
      <div className="form-wrapper">
        <span className="logo"><img src={pen} className='pen-logo' />PenPals</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input className="input-form" type="text" placeholder="username" />
          <input className="input-form" type="email" placeholder="email" />
          <input className="input-form" type="password" placeholder="password" />
          <input className="input-form" type="password" placeholder="confirm password" />
          <input className="input-form" style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src={upload} alt="upload-icon" className="avatar-upload-icon" /><span className="add-picture">Add profile picture</span>
          </label>
          <button className="signup-button" type="submit">
            {loading ? <BeatLoader color={"#262b15"} loading={loading} /> : "Sign Up"}
          </button>
          {error && <span>{error}</span>}
        </form>
        <p className="have-account">Already have an account? <Link className="link-style" to="/login">login</Link></p>
      </div>
    </div>
  )
}

export default Register;
