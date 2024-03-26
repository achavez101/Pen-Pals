import React, { useState } from 'react'
import {
  createUserWithEmailAndPassword,
  updateProfile, getAuth, updateEmail,
  updatePassword, sendEmailVerification,
  EmailAuthProvider, reauthenticateWithCredential
} from "firebase/auth";
import { auth, storage, db } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { updateAndVerifyEmail } from './EmailVerification';

function UpdateEmail() {
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target[0].value;
    const confirmEmail = event.target[1].value;
    const currentPassword = event.target[2].value;
    const auth = getAuth();
    const user = auth.currentUser;

    if (email !== confirmEmail) {
      setError("Email's do not match");
      return;
    }
    try {
      await updateAndVerifyEmail(email, currentPassword)
    }
    catch (error) {
      setError(error.message);
    }
    navigate('/');
  };

  return (
    <div className="settings-form-container">
      <div className="form-wrapper">
        <form onSubmit={handleSubmit}>
          <h2>Change Email</h2>
          <input className="input-form" type="email" placeholder="email" />
          <input className='input-form' type='email' placeholder='confirm email' />
          <input className="input-form" type="password" placeholder="current password" />
          <button className="update-button">update profile</button>
          {error && <span>{error}</span>}
        </form>

      </div>
    </div>
  )
}

export default UpdateEmail;