import React, { useState } from 'react';
import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'
import Navbar from '../components/Navbar'
import { TabProvider } from '../context/TabContext';

function Home() {
  return (
    <TabProvider>
    <div className="home">
      <div className="home-container">
        <Navbar className="navbar"/>
        <div className='content-container'>
        <Sidebar/>
        <Chat />
        </div>
      </div>
    </div>
    </TabProvider>
  )
}

export default Home