import React, { useState } from 'react';
import Settings from './Settings';

const SettingsModal = ({ onClose }) => {
 return (
    <div className="settingsModal">
      <div className="settings-modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <Settings />
      </div>
    </div>
 );
};

export default SettingsModal;
