import React from 'react'
import Header from '../../component/Header/Header'
import Footer from '../../component/Footer/Footer'
import { useNavigate } from 'react-router-dom'

const Termsconditions = () => {
  const navigate = useNavigate();
  return (
    <div>
        <Header/>
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
<div style={{ marginTop: '120px' }}>
<div>
    <div class="container2">
        <h1>Terms and Conditions for [Ajay kumar BDS]</h1>
        <p><strong>Effective Date:</strong> January 8, 2025</p>
        
        <p>Welcome to [Ajay kumar BDS]! These terms and conditions govern your use of our website and services. By accessing or using our website, you agree to abide by these terms. If you do not agree, please do not use our services.</p>
        
        <h2>1. General Information</h2>
        <ul>
            <li>This website provides chapter-wise dental notes, PDFs, and educational resources for BDS students.</li>
            <li>All content is for educational purposes only and should not be considered professional or medical advice.</li>
        </ul>
        
        <h2>2. User Responsibilities</h2>
        <ul>
            <li>Users must provide accurate information during registration or purchase.</li>
            <li>Unauthorized sharing, copying, or distribution of purchased notes is prohibited.</li>
            <li>The website must not be used for any illegal or unauthorized purposes.</li>
        </ul>
        
        <h2>3. Intellectual Property</h2>
        <ul>
            <li>All content, including notes, PDFs, and images, is the intellectual property of [Ajay kumar BDS].</li>
            <li>Reproduction or redistribution without prior permission is strictly prohibited.</li>
        </ul>
        
        <h2>4. Payment and Refunds</h2>
        <ul>
            <li>Payments are processed securely through third-party gateways.</li>
        </ul>
        
        <h3>Refund Policy</h3>
        <ul>
            <li>Once our content is purchased, refunds will not be provided, as the material is delivered in a digital format and cannot be returned.</li>
            <li>However, we value your trust and satisfaction. To ensure you are confident in your purchase, we offer demo content for you to review before making a decision. This allows you to evaluate the quality and relevance of our material beforehand.</li>
            <li>We take pride in the accuracy, clarity, and usefulness of our content and are confident it will meet your expectations.</li>
            <li>If there is an issue with the content, users may contact us at [ajayk061999@gmail.com].</li>
        </ul>
        
        <h2>5. Limitation of Liability</h2>
        <ul>
            <li>We strive to provide accurate and reliable content, but we do not guarantee the completeness or error-free nature of the material.</li>
            <li>The website and its owners are not liable for any loss, damage, or misuse arising from the use of the notes or website services.</li>
        </ul>
        
        <h2>6. Privacy Policy</h2>
        <p>By using this website, you agree to the collection and use of your data as outlined in our Privacy Policy.</p>
        
        <h2>7. Changes to Terms</h2>
        <ul>
            <li>We reserve the right to update or modify these terms at any time without prior notice.</li>
            <li>Changes will be effective immediately upon posting on this page.</li>
        </ul>
        
        <h2>8. Governing Law</h2>
        <p>These terms are governed by the laws of [India].</p>
        
        <h2>9. Contact Us</h2>
        <p>For any questions or concerns, please contact us at:</p>






        <p>Email: [ajayk061999@gmail.com]</p>
             <h2>9. Owner Name</h2>
        <p>AJAY KUMAR</p>
    </div>
</div>

    </div>
    <Footer/>
    </div>
  )
}

export default Termsconditions
