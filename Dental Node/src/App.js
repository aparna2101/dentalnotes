import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/homepage/Home';
import Login from './pages/Login/Login';
import ForgotPassword from './pages/Login/ForgotPassword';
import ResetPassword from './pages/Login/ResetPassword';
import Contact from './pages/Contact/Contact';

import Signup from './component/signup/Signup';
import Notes from './pages/Notes/Notes';
import NotesSubject from './pages/NotesSubject/NotesSubject';
import Chapter from './pages/Chapter/Chapter';
import Chapterpdf from './pages/Chapterpdf/Chapterpdf';
import Subcription from './pages/Subcription/Subcription';
import ProtectedRoute from './component/protectedRoute/protectedRoute';
import  { useState, useEffect } from "react";
import RefundPolicy from './pages/Refund-Policy/RefundPolicy';
import Termsconditions from './pages/Terms&Cnditions/Terms&Cnditions';
import PrivacyPolicy from './pages/Privacy-Policy/PrivacyPolicy';
import Demo from './pages/Demo/Demo';


function App() {


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === "PrintScreen" ||
        (e.ctrlKey && e.shiftKey && (e.key === "s" || e.key === "S"))
      ) {
        e.preventDefault();
        alert("Screenshots are disabled!");
      }
    };
  
    document.addEventListener("keydown", handleKeyDown);
  
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const detectDevTools = () => {
      const element = new Image();
      Object.defineProperty(element, 'id', {
        get: () => {
          document.body.innerHTML = '<h1>Developer tools are not allowed!</h1>';
        },
      });
      console.log(element);
    };

    window.addEventListener('devtoolschange', detectDevTools);
    return () => {
      window.removeEventListener('devtoolschange', detectDevTools);
    };
  }, []);

  const handleRightClick = (e) => {
    e.preventDefault();
    alert('Right-click is disabled on this website.');
  };

  // phone screenshot

  const [isBlurred, setIsBlurred] = useState(false);



  return (
  <>
  <div onContextMenu={handleRightClick} >
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/Contact" element={<Contact/>} />

        <Route path="/signup" element={<Signup/>} />
        {/* <Route path="/notes" element={<Notes/>} /> */}
        <Route path="/notessubject" element={<NotesSubject/>} />
        <Route path="/notessubject/:id" element={<Chapter/>} />
        {/* <Route path="/chapterpdf/:id" element={<Chapterpdf/>} /> */}

        <Route
          path="/chapterpdf/:id"
          element={
            <ProtectedRoute>
              <Chapterpdf />
            </ProtectedRoute>
          }
        />
        <Route path="/Subscription" element={<Subcription/>} />
        <Route path="/RefundPolicy" element={<RefundPolicy/>} />
        <Route path="/Terms&conditions" element={<Termsconditions/>} />
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy/>} />
        <Route path="/demo" element={<Demo/>} />
        </Routes>
        </BrowserRouter>
        </div>
  </>
  );
}

export default App;
