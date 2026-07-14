import React from 'react'
import './Sidebar.css'
import add_product_icon from '../Assets/Product_Cart.svg'
import list_product_icon from '../Assets/Product_list_icon.svg'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>


      <Link to='/admin/addsubject' style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <img src={add_product_icon} alt="" />
          <p>Add  Subject</p>
        </div>
      </Link>


      <Link to='/admin/AddChapter' style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <img src={list_product_icon} alt="" />
          <p>Add Chapters</p>
        </div>
      </Link>

      <Link to='/admin/addChapterVideo' style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <img src={add_product_icon} alt="" />
          <p>Add Chapter Video</p>
        </div>
      </Link>

      <Link to='/admin/addDemoVideo' style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <img src={add_product_icon} alt="" />
          <p>Add Demo Video</p>
        </div>
      </Link>

      <Link to='/admin/manageBundles' style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <img src={add_product_icon} alt="" />
          <p>Manage Bundles</p>
        </div>
      </Link>

      <Link to='/admin/manageSubscription' style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <img src={add_product_icon} alt="" />
          <p>Manage Subscription</p>
        </div>
      </Link>


      {/* <Link to='/admin/chapterOverView' style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <img src={add_product_icon} alt="" />
          <p>chapter Overview</p>
        </div>
      </Link> */}


      <Link to='/admin/overView' style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <img src={list_product_icon} alt="" />
          <p>Subject OverView</p>
        </div>
      </Link>



      <Link to='/admin/orgSettings' style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <img src={add_product_icon} alt="" />
          <p>Settings</p>
        </div>
      </Link>
      
    </div>
  )
}

export default Sidebar
