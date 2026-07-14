import React from 'react'
import './Navbar.css'
import navlogo from '../Assets/Replogo.png'

import navprofileIcon from '../Assets/ajay.jpeg'

const Navbar = () => {
  return (
    <div className='navbar'>
    <div className='maim-logo'>
    <img src={navlogo} className='nav-logo' alt="" />
    </div>
      
      <div className='nam-img'>
      <img src={navprofileIcon} className='nav-profile' alt="" />
      </div>
      
    </div>
  )
}

export default Navbar
