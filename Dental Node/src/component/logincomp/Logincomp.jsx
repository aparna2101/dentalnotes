import axios from "axios";
import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import environment from "../../enviroment";
import Typography from '@mui/material/Typography'
import { toast } from "react-toastify";

const Logincomp = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [loading,setLoading]=useState(false)

  const navigate = useNavigate();

  const [logindata, setLogindata] = useState({
    email: "",
    password: "",
  });

  const loginHandle = (e) => {
    setLogindata({ ...logindata, [e.target.name]: e.target.value });
  };

  const loginUser = async (e) => {
    try {

    
      e.preventDefault();
      const newdata = logindata;
        setLoading(true)
      const response = await axios.post(
        `${environment.endPoint}/api/v1/website/user/login`,
        logindata
      );
      console.log("response", response?.data?.data?.token);

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user",JSON.stringify( response.data.data.user));
        setLoading(false)
        navigate("/notessubject");
      } else {
          setLoading(false)
        toast.error(response?.data?.message || "Something Went wrong");
      }
    } catch (error) {
     
        setLoading(false)
      console.log("error", error);
      toast.error(error?.response?.data?.message||"Invalid credentials");
    }
  };
  console.log();

  return (
    <>
      <div>
        <div class="w-screen min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800 px-4 sm:px-6 lg:px-8">
          <div class="relative py-3 sm:max-w-xs sm:mx-auto">

            <div class="min-h-96 px-8 py-6 mt-4 text-left bg-white dark:bg-gray-900  rounded-xl shadow-lg relative">
              <button 
                type="button"
                onClick={() => window.history.back()}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                style={{ background: 'none', border: 'none' }}
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              <Typography variant="body1" color="initial" sx={{fontWeight:600,color:"black",textAlign:"center",my:2, fontStyle:"italic",bgcolor:"white"}}> First Sign-up , then Login</Typography>
              <div class="flex flex-col justify-center items-center h-full select-none">
                   
                <div class="flex flex-col items-center justify-center gap-2 mb-8">
                  <a href="" target="_blank">
                    <img src="/img/newLogo.png" class="w-20" />
                  </a>
                  <p class="m-0 text-[16px] font-semibold dark:text-white">
                    Login to your Account
                  </p>
                  <span class="m-0 text-xs max-w-[90%] text-center text-[#8B8E98]">
                    Get started with our platform, just start section and enjoy
                    experience.
                  </span>
                </div>
                <div class="w-full flex flex-col gap-2">
                  <label class="font-semibold text-xs text-gray-400 ">
                    Email
                  </label>
                  <input
                    class="border rounded-lg px-3 py-2 mb-5 text-sm w-full outline-none border-gray-500 bg-gray-900 !text-white"
                    placeholder="Email"
                    style={{ color: "black" }}
                    name="email"
                    type="email"
                    value={logindata.email}
                    onChange={loginHandle}
                  />
                </div>
              </div>
              <div class="w-full flex flex-col gap-2">
                <label class="font-semibold text-xs text-gray-400 ">
                  Password
                </label>
                <div className="flex justify-between items-center border-gray-600 bg-gray-900 bg-opacity-40 border rounded-lg px-3 py-2 mb-3">
                  <input
                    type={showPassword ? "text" : "password"}
                    class=" text-sm w-full outline-transparent bg-gray-900 text-white focus:outline-none"
                    placeholder="••••••••"
                    name="password"
                    value={logindata.password}
                    onChange={loginHandle}
                  />
                  <button
                    type="button"
                    className="text-gray-400 text-sm"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <i className="fa-regular fa-eye text-white"></i>
                    ) : (
                      <i className="fa-regular fa-eye-slash text-white"></i>
                    )}
                  </button>
                </div>
              </div>
              <div className="flex justify-end mt-1">
                <Link to="/forgot-password" size="small" className="text-xs text-[#ef305c] hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="mt-5">

                <button
                  class="py-1 px-8 bg-[#ef305c] hover:bg-blue-800 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg cursor-pointer select-none"
                  onClick={loginUser}
                >
               {loading?"login..":"login"}
                </button>
              </div>

              <div className="mt-5">
                <button class="py-1 px-8 bg-[#ef305c] hover:bg-blue-800 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg cursor-pointer select-none">
                  <Link to="/signup">Signup</Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default Logincomp;
