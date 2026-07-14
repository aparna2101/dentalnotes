import { BrowserRouter,Routes,Route  } from "react-router-dom";
import Footer from "./Components/Footer/Footer";
import Navbar from "./Components/Navbar/Navbar";
import Admin from "./Pages/Admin";
import Login from "./Components/loginPage/login";
import { useNavigate } from "react-router-dom";
export const backend_url = 'https://api.dentalnotesrep.com';
export const currency = '₹';
import { Navigate } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Admin Dashboard */}
          <Route path="/admin/*" element={<Admin />} />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
