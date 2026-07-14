import React from 'react'
import Hero from '../../component/Hero/Hero'
import Header from '../../component/Header/Header'
import About from '../../component/About/About'
import Footer from '../../component/Footer/Footer'
import Testimonial from '../../component/Testimonial/Testimonial'
import About2 from '../../component/About2/About2'
import  { useState, useEffect } from "react";
const Home = () => {
  
    const [showPopup, setShowPopup] = useState(false);
    
    
    useEffect(() => {
      // Check if popup was already shown
      const isPopupShown = localStorage.getItem("popupShown");
  
      if (!isPopupShown) {
        setShowPopup(true);
        localStorage.setItem("popupShown", "true"); // Set the flag to true
      }
    }, []);
  
    const closePopup = () => {
      setShowPopup(false);
    };
  return (
    <div>

{showPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center !w-[250px] md:!w-[400px]">
            <h2 className="text-2xl font-bold mb-4">You can save in Desktop</h2>
            <p className="text-gray-600 mb-4">
              Save this website for easy access on your desktop.
            </p>
            <div className='w-[70px] text-center mx-auto mb-10'>
              <img src='/img/desktop.jpg' className='w-full' alt="" />
            </div>
            <button
              onClick={closePopup}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    <Header/>
      <Hero/>
      <About/>
      <About2/>
      <Testimonial/>
      <Footer/>

    </div>
  )
}

export default Home
