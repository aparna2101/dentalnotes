import React, { useState } from "react";
import { Toaster, toast } from "sonner";
import environment from "../../enviroment";
const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [signupdata, setSignupdata] = useState({
    email: "",
    password: "",
    lastName: "",
    firstName: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");

  const validatePassword = (value) => {
    const regex =
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!regex.test(value)) {
      return "Password must contain at least one uppercase letter, one number, one special character, and be at least 8 characters long.";
    }
    return "";
  };
  const signupHandle = (e) => {
    if (e.target.name == "password") {
      validatePassword(e.target.value);
    }
    setSignupdata({
      ...signupdata,
      [e.target.name]: e.target.value,
    });
  };
  console.log(signupdata.password);

  const createUser = async (e) => {
    e.preventDefault();

    const passwordError = validatePassword(signupdata.password);
    if (passwordError) {
      toast.error(
        "Password must contain at least one uppercase letter, one number, one special character, and be at least 8 characters long"
      );
      return;
    }
    const newdata = signupdata;
    const response = await fetch(
      `${environment.endPoint}/api/v1/website/user/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newdata),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success("Registration successful! Redirecting to login...");
          setTimeout(() => {
            window.location.href = "/login";
          }, 1500);
        } else {
debugger

         
          toast.error(data.message||"something went wrong");
        }
      });
  };

  return (
    <div>
      <Toaster position="top-center" richColors /> {/* Toaster configuration */}
      <div class="w-screen min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800 px-4 sm:px-6 lg:px-8">
        <div class="w-full max-w-md space-y-8">
          <div class="bg-white shadow-md rounded-md p-6 relative">
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
            <img
              class="mx-auto h-12 w-auto"
              src="https://www.svgrepo.com/show/499664/user-happy.svg"
              alt=""
            />

            <h2 class="my-3 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign up for an account
            </h2>

            <form class="space-y-6" method="POST">
              <div>
                <label
                  for="new-password"
                  class="block text-sm font-medium text-gray-700"
                >
                  FirstName
                </label>
                <div class="flex justify-between items-center   bg-opacity-40 border rounded-lg px-3 py-2 mb-3">
                  <input
                    name="firstName"
                    type="text"
                    required
                    value={signupdata.firstName}
                    onChange={signupHandle}
                    class="text-sm w-full outline-transparent   focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  for="new-password"
                  class="block text-sm font-medium text-gray-700"
                >
                  lastName
                </label>
                <div class="flex justify-between items-center   bg-opacity-40 border rounded-lg px-3 py-2 mb-3">
                  <input
                    name="lastName"
                    type="text"
                    required
                    value={signupdata.lastName}
                    onChange={signupHandle}
                    class="text-sm w-full outline-transparent   focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  for="password"
                  class="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div class="flex justify-between items-center   bg-opacity-40 border rounded-lg px-3 py-2 mb-3">
                  <input
                    name="email"
                    type="email-address"
                    autocomplete="email-address"
                    required
                    value={signupdata.email}
                    onChange={signupHandle}
                    class="text-sm w-full outline-transparent   focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  for="password"
                  class="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <div class="flex justify-between items-center   bg-opacity-40 border rounded-lg px-3 py-2 mb-3">
                  <input
                    name="phoneNumber"
                    type="number"
                    autocomplete="email-address"
                    required
                    value={signupdata.phoneNumber}
                    onChange={signupHandle}
                    class="text-sm w-full outline-transparent   focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  for="password"
                  class="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div class="flex justify-between items-center   bg-opacity-40 border rounded-lg px-3 py-2 mb-3">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autocomplete="password"
                    required
                    value={signupdata.password}
                    onChange={signupHandle}
                    class="text-sm w-full outline-transparent   focus:outline-none"
                  />

                  <button
                    type="button"
                    className="text-gray-400 text-sm"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <i className="fa-regular fa-eye "></i>
                    ) : (
                      <i className="fa-regular fa-eye-slash "></i>
                    )}
                  </button>
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {error && signupdata.password && (
                  <p style={{ color: "green" }}>Password is valid!</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  onClick={createUser}
                  class="flex w-full justify-center rounded-md border border-transparent bg-[#ef305c] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
                >
                  Register Account
                </button>
              </div>
            </form>

            <div className="mt-5 pt-4 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal">
                Can't signup or facing issue? <a href="https://api.whatsapp.com/send?phone=9354169122" target="_blank" rel="noopener noreferrer" className="text-[#ef305c] hover:underline font-semibold">Click here</a>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
