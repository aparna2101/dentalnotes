import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import Service from "../../pages/serivce/service"

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate=useNavigate()
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
     console.log("find the token",token)
      if (!token) {
        setIsAuthenticated(false); // No token, redirect to login
        return;
      }

      try {
       
        // const response=await Service.verify()
        // const data=response.data
        console.log("data checking")
        if(true){
            setIsAuthenticated(true)
        }else{

            navigate("/Subscription")
        }
        

      
    
      } catch (error) {
        console.error("Token validation failed:", error);
        setIsAuthenticated(false); // Invalid token, redirect to login
      }
    };

    validateToken();
  }, []);

  // Show a loading indicator while validating the token
  if (isAuthenticated === null) return <div>Loading...</div>;

  // Redirect to login if not authenticated
  if (!isAuthenticated) return <Navigate to="/login" />;

  // Render the protected content
  return children;
};

export default ProtectedRoute;
