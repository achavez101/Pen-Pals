import React, { useState } from 'react';
import UpdateEmail from "./UpdateEmail";
import UpdatePassword from './UpdatePassword';
import UpdateProfile from './UpdateProfile';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('updatePassword');

    return(
        <div>
          <div className='settings-button-container'>
            <button className='settings-button' onClick={() => setActiveTab('updateEmail')}>Change Email</button>
            <button className='settings-button' onClick={() => setActiveTab('updatePassword')}>Change Password</button>
            <button className='settings-button' onClick={() => setActiveTab('updateProfile')}>Update Profile</button>
          </div>
          <div>
            {activeTab === 'updateEmail' && <ChangeEmail />}
            {activeTab === 'updatePassword' && <ChangePassword />}
            {activeTab === 'updateProfile' && <ChangeProfile />}
          </div>
        </div>
      )

      function ChangeEmail() {

        return(
            <UpdateEmail />
        )
      }

      function ChangePassword() {

        return(
            <UpdatePassword />
        )
      }
     
      function ChangeProfile() {

        return(
            <UpdateProfile />
        )
        console.log('button clicked')
      }
}

export default Settings