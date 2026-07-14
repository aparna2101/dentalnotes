import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import environment from '../../enviroment';
import { toast } from 'react-toastify';
import Typography from '@mui/material/Typography';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.put(`${environment.endPoint}/api/v1/website/user/forgetPassword`, { email });
            if (response.data.success) {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Forgot password error", error);
            toast.error(error.response?.data?.message || "Failed to send reset link");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-screen min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800 px-4 sm:px-6 lg:px-8">
            <div className="relative py-3 sm:max-w-xs sm:mx-auto">
                <div className="min-h-96 px-8 py-6 mt-4 text-left bg-white dark:bg-gray-900 rounded-xl shadow-lg relative">
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
                    <Typography variant="body1" sx={{ fontWeight: 600, color: "black", textAlign: "center", my: 2, fontStyle: "italic", bgcolor: "white" }}>
                        Forgot Password
                    </Typography>
                    <div className="flex flex-col items-center justify-center gap-2 mb-8 text-center">
                        <img src="/img/newLogo.png" className="w-20" alt="Logo" />
                        <p className="m-0 text-[16px] font-semibold dark:text-white">Reset Password</p>
                        <span className="m-0 text-xs text-[#8B8E98]">
                            Enter your email to receive a reset link.
                        </span>
                    </div>
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-xs text-gray-400">Email Address</label>
                            <input
                                className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-500 bg-gray-900 text-white"
                                placeholder="Enter your email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="py-1 px-8 bg-[#ef305c] hover:bg-blue-800 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md rounded-lg cursor-pointer disabled:opacity-50"
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>
                    <div className="mt-5 text-center">
                        <Link to="/login" className="text-sm text-[#ef305c] hover:underline">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
