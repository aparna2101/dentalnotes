import React from 'react'
import './RefundPolicy.css'
import Header from '../../component/Header/Header'
import Footer from '../../component/Footer/Footer'
import { useNavigate } from 'react-router-dom'

const RefundPolicy = () => {
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
<div>

    <div class="container2">
    <h1>Refund Policy</h1>
        <ul>
            <li>Once our content is purchased, refunds will not be provided, as the material is delivered in a digital format and cannot be returned.</li>
            
            <li>However, we value your trust and satisfaction. To ensure you are confident in your purchase, we offer demo content for you to review before making a decision. This allows you to evaluate the quality and relevance of our material beforehand.</li>
            
            <li>We take pride in the accuracy, clarity, and usefulness of our content and are confident it will meet your expectations.</li>
        </ul>
    </div>
</div>
    </div>
    <Footer/>
    </>
    
  )
}

export default RefundPolicy
