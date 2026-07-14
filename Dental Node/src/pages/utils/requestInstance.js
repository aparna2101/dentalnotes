// import axios from 'axios';
// import environment from '../../enviroment';
// const axiosInstance = axios.create({
//   baseURL: environment.endPoint //', // Replace with your API base URL
// });

// // Add a request interceptor to include the token in headers
// axiosInstance.interceptors.request.use(

//   (config) => {
//     alert("hiii shakir")
//     debugger
//     const token = localStorage.getItem('token'); // Adjust the key as per your localStorage key for the token
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;



import axios from "axios";
import environment from "../../enviroment";

const axiosInstance = axios.create({
  baseURL: environment.endPoint, // Base URL for all requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: optional global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Axios Error:", error.response || error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
