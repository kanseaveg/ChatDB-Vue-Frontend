import React, { useEffect, useState } from 'react';
import LeftSidebar from './components/LeftSidebar';
import RightMain from './components/RightMain';
import './App.scss'
import './base.css'
function App() {
  return (
    <div className='App'>
      <LeftSidebar/>
      <RightMain/>
    </div>
  );
}

export default App;
