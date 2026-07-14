import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import environment from '../../enviroment';
import { toast } from 'react-toastify';
import Typography from '@mui/material/Typography';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const emailParam = searchParams.get('email');
        const otpParam = searchParams.get('otp');
        if (emailParam && otpParam) {
            setFormData(prev => ({ ...prev, email: emailParam, otp: otpParam }));
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.put(`${environment.endPoint}/api/v1/website/user/resetPassword`, {
                email: formData.email,
                resetPasswordOTP: formData.otp,
                newPassword: formData.newPassword
            });

            if (response.data.success) {
                toast.success(response.data.message);
                setTimeout(() => navigate('/login'), 2000);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Reset password error", error);
            toast.error(error.response?.data?.message || "Failed to reset password");
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
                        New Password
                    </Typography>
                    <div className="flex flex-col items-center justify-center gap-2 mb-8 text-center">
                        <img src="/img/newLogo.png" className="w-20" alt="Logo" />
                        <p className="m-0 text-[16px] font-semibold dark:text-white">Create New Password</p>
                    </div>
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-xs text-gray-400">New Password</label>
                            <input
                                className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-500 bg-gray-900 text-white"
                                placeholder="••••••••"
                                type="password"
                                value={formData.newPassword}
                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-xs text-gray-400">Confirm New Password</label>
                            <input
                                className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-500 bg-gray-900 text-white"
                                placeholder="••••••••"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="py-1 px-8 bg-[#ef305c] hover:bg-blue-800 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md rounded-lg cursor-pointer disabled:opacity-50"
                        >
                            {loading ? "Updating..." : "Reset Password"}
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

export default ResetPassword;
