import React from 'react'
import Header from '../../component/Header/Header'
import Footer from '../../component/Footer/Footer'
import { useNavigate } from 'react-router-dom'
const PrivacyPolicy = () => {
  const navigate = useNavigate();
  return (
    <>
      <Header/>
      <div style={{ marginTop: '120px' }}>
        {/* Back Button - Positioned to the side */}
        <button 
          onClick={() => navigate(-1)}
          style={{ 
            position: "fixed",
            left: "20px",
            top: "120px",
            zIndex: 100,
            color: "#333", 
            fontWeight: "bold", 
            fontSize: "1rem",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "50px",
            cursor: "pointer",
            padding: "8px 15px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center"
          }}
        >
          <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>←</span> Back
        </button>
        <div class="container2">
        <h1><strong>Privacy Policy</strong></h1>
        <p><strong>Effective Date:</strong> January 8, 2025</p>
        
        <p>At [Ajay kumar BDS], we are committed to protecting your personal information and ensuring transparency about how we collect, use, and store your data. This Privacy Policy outlines our practices to keep your data safe and secure.</p>
        
        <h2>1. Information We Collect</h2>
        <ul>
            <li><strong>Personal Information:</strong> Name, email address, phone number, and billing information when you register or purchase.</li>
            <li><strong>Usage Data:</strong> Your interaction with our website, including pages visited, time spent, and other analytics.</li>
            <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers.</li>
        </ul>
        
        <h2>2. How We Use Your Information</h2>
        <ul>
            <li>Process your purchases and deliver the content.</li>
            <li>Improve and personalize your user experience.</li>
            <li>Provide customer support and respond to inquiries.</li>
            <li>Send promotional emails (only if you opt-in).</li>
        </ul>
        
        <h2>3. Data Security</h2>
        <p>We implement industry-standard security measures to protect your personal information from unauthorized access, misuse, or disclosure. However, no online platform is entirely risk-free, and we cannot guarantee absolute security.</p>
        
        <h2>4. Third-Party Services</h2>
        <ul>
            <li><strong>Payment Gateways:</strong> To process your payments securely.</li>
            <li><strong>Analytics Tools:</strong> To understand user behavior and improve the website.</li>
        </ul>
        <p>We do not sell or rent your personal information to any third party.</p>
        
        <h2>5. Cookies and Tracking</h2>
        <p>Our website uses cookies to enhance your experience by:</p>
        <ul>
            <li>Remembering your preferences.</li>
            <li>Tracking website usage for analytics.</li>
        </ul>
        <p>You can control or disable cookies through your browser settings.</p>
        
        <h2>6. Your Rights</h2>
        <ul>
            <li>Access, update, or delete your personal information.</li>
            <li>Opt-out of promotional communications.</li>
            <li>Contact us for any data-related concerns at support@dentalnotesrep.com.</li>
        </ul>
        
        <h2>7. Policy Updates</h2>
        <p>We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. Any updates will be posted on this page, and the "Effective Date" will be updated accordingly.</p>
        
        <h2>8. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy or how we handle your data, please reach out to us at: dentalnotesrep.com.</p>
    </div>
</div>
<Footer/>
      
    </>
  )
}

export default PrivacyPolicy
