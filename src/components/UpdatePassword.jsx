import React, { useState } from 'react';
import {
 getAuth,
 updatePassword,
 reauthenticateWithCredential,
 EmailAuthProvider
} from "firebase/auth";
import { useNavigate, Link } from 'react-router-dom';


const UpdatePassword = () => {
 const [error, setError] = useState(false);
 const navigate = useNavigate();

 const handleSubmit = async (event) => {
    event.preventDefault();
    const newPassword = event.target[0].value;
    const confirmPassword = event.target[1].value;
    const currentPassword = event.target[2].value;
    const auth = getAuth();
    const user = auth.currentUser;

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Reauthenticate the user with their current password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update the password
      await updatePassword(user, newPassword);
      console.log("Password updated successfully.");
      navigate('/Login');
    } catch (error) {
      setError(error.message);
    }
 };

 return (
    <div className="settings-form-container">
      <div className="form-wrapper">
        <form onSubmit={handleSubmit}>
          <h2>Change Password</h2>
          <input className="input-form" type="password" placeholder="new password" />
          <input className='input-form' type='password' placeholder='confirm password' />
          <input className="input-form" type="password" placeholder="current password" />
          <button className="update-button">update profile</button>
          {error && <span>{error}</span>}
        </form>
      </div>
    </div>
 );
};

export default UpdatePassword;
