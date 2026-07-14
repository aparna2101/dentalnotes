import { useState, useEffect } from "react";
import Header from "../../component/Header/Header";
import { Box, Typography, Modal, IconButton } from "@mui/material";
import axios from "axios";
import Service from "../../pages/serivce/service";
import { useNavigate } from "react-router-dom";
import environment from "../../enviroment";
import { toast } from "react-toastify";

const Subcription = () => {
  const [openVideo, setOpenVideo] = useState(false);
  const navigate = useNavigate();

  const [settings, setSettings] = useState(() => {
    const paymentData = localStorage.getItem("payment");

    if (paymentData) {
      try {
        const parsed = JSON.parse(paymentData);
        const now = Date.now();

        // Check if redirectionTime is older than 5 minutes (300,000 ms)
        if (
          parsed.redirectingTime &&
          now - parsed.redirectingTime < 5 * 60 * 1000
        ) {
          return parsed; // ✅ valid, return stored data
        }
      } catch (err) {
        console.error("Invalid payment data:", err);
      }
    }

    // ⛔ If no data or expired → return default
    return {
      subscriptionType: "default",
      moduleInfo: {},
    };
  });

  const handlePayment = async () => {
    try {
      let userId = JSON.parse(localStorage.getItem("user"))?._id;
      let token = localStorage.getItem("token") || null;

      if (!userId || !token) {
        toast.warning("First sign up, then login to pay");
        localStorage.clear();
        navigate("/login");
        return;
      }

      if (!userId) {
        toast.error("Please first login before payment");
        return;
      }

      const newData = {
        name: "Waleed",
        amount: 1,
        number: "7498608775",
        MUID: "MUID" + Date.now(),
        userId: userId,
        transactionId: "T" + Date.now(),
        subscriptionInfoObject: settings,
      };

      const formData = new FormData();
      formData.append("name", newData.name);
      formData.append("amount", newData.amount);
      formData.append("number", newData.number);
      formData.append("MUID", newData.MUID);
      formData.append("transactionId", newData.transactionId);
      formData.append("subscriptionInfoObject", newData.subscriptionInfoObject);

      const response = await Service.createPayment({ body: newData });

      if (response?.data) {
        // Redirect the user to the PhonePe payment page with the token
        window.location.href = `${response.data.redirect}`;
      } else {
        alert("Failed to retrieve payment token. Please try again.");
      }
    } catch (error) {
      console.error("Payment error: ", error);
      alert(`Error while processing payment: ${error.message}`);
    }
  };

  async function fetchSubscriptionInfo() {
    try {
      const response = await Service.getPyamentSettings();
      console.log("subscription response", response);
      if (response && response.data && response.data.length > 0) {
        // Merge fetched settings with existing settings to preserve localStorage data
        setSettings((prev) => ({
          ...response.data[0], // Global settings (promo video, etc.)
          ...prev, // Current payment data (specific price, subject name)
          subscription: {
            ...response.data[0].subscription, // Global subscription info
            ...(prev.subscriptionType === "default" ? {} : { price: prev.moduleInfo?.price, planName: prev.moduleInfo?.subjectName || prev.moduleInfo?.planName })
          }
        }));
      }
    } catch (error) {
      console.error("fetchSubscriptionInfo error", error);
    }
  }

  useEffect(() => {
    fetchSubscriptionInfo();
  }, []);

  return (
    <>
      <div style={{ maxWidth: "1200px", margin: "24px auto 0", padding: "0 20px" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            color: "#333",
            fontWeight: "bold",
            fontSize: "0.9rem",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "50px",
            cursor: "pointer",
            padding: "6px 12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            display: "inline-flex",
            alignItems: "center",
            marginBottom: "15px"
          }}
        >
          <span style={{ marginRight: '6px', fontSize: '1rem' }}>←</span> Back
        </button>
        <div class="p-4 w-[90%] mx-auto">

          {settings?.subscription?.promoVideoUrl && (
            <div className="mb-10 text-center">
              <button
                onClick={() => setOpenVideo(true)}
                style={{
                  backgroundColor: "#ef305c",
                  color: "#fff",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  padding: "12px 30px",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#d92650"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#ef305c"}
              >
                Watch video before payment
              </button>
            </div>
          )}

          <Modal
            open={openVideo}
            onClose={() => setOpenVideo(false)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(8px)",
              bgcolor: "rgba(0,0,0,0.7)"
            }}
          >
            <Box sx={{
              position: "relative",
              width: "auto",
              maxWidth: "95vw",
              maxHeight: "95vh",
              bgcolor: "#000",
              borderRadius: "15px",
              overflow: "hidden",
              boxShadow: "0 0 50px rgba(0,0,0,0.5)",
              display: "flex",
              flexDirection: "column"
            }}>
              <IconButton
                onClick={() => setOpenVideo(false)}
                sx={{
                  position: "absolute",
                  top: 15,
                  right: 15,
                  color: "#fff",
                  zIndex: 10,
                  bgcolor: "rgba(0,0,0,0.6)",
                  "&:hover": { bgcolor: "#ef305c" }
                }}
              >
                <Typography sx={{ fontWeight: 'bold', px: 1 }}>✕</Typography>
              </IconButton>
              <video
                src={settings?.subscription?.promoVideoUrl}
                controls
                autoPlay
                style={{
                  maxWidth: "100%",
                  maxHeight: "90vh",
                  display: "block",
                  objectFit: "contain"
                }}
              />
            </Box>
          </Modal>

          <div class="max-w-lg mx-auto rounded-lg overflow-hidden lg:max-w-none lg:flex my-10 shadow-teal border-4 border-[#1353fe]">
            <div class=" px-6 py-8 lg:flex-shrink-1 lg:p-12 bg-[#ef305c] flex flex-col justify-center">
              <h3 class="text-3xl text-left leading-9 font-extrabold text-white mb-6">
                Access & Usage Policy
              </h3>
              <p class="mt-2 text-left font-ttnorms leading-8 text-white text-lg ">
                All study materials are available exclusively on our website and can be accessed after successful payment through your registered account. These notes are intended for personal academic use.
              </p>
              <p class="mt-4 text-left font-ttnorms leading-8 text-white text-lg ">
                We kindly request that the content is not downloaded, copied, shared, or distributed in any form, so that its quality and exclusivity are maintained for all users.
              </p>
              <p class="mt-4 text-left font-ttnorms leading-8 text-white text-lg ">
                By proceeding with the payment, you agree to these terms.
              </p>
            </div>
            <div class="py-12 px-6 text-center bg-[#ef305c] lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center lg:p-12">

              <div class="mt-4 flex items-center justify-center text-sm leading-5 font-semibold text-gray-200">
                One-Time Payment: ₹{settings?.subscriptionType !== "default"
                  ? settings?.moduleInfo?.price
                  : settings?.subscription?.price}/-
              </div>
              <div class="mt-4 flex items-center justify-center text-5xl leading-none font-extrabold text-white">
                <span>
                  {" "}
                  ₹{settings?.subscriptionType !== "default"
                    ? settings?.moduleInfo?.price
                    : settings?.subscription?.price}/-
                </span>
                <span class="ml-3 text-xl leading-7 font-medium text-gray-200">
                  /One Year access
                </span>
              </div>
              <div class="mt-6">
                <div class="rounded-md shadow">
                  <button
                    onClick={handlePayment}
                    class="flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-[#1353fe] hover:bg-blue-600 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                  >
                    Agree & Pay
                  </button>
                </div>
              </div>
              <div class="mt-4 text-sm leading-5">
                <a
                  href="#"
                  class="font-medium text-white transition duration-150 ease-in-out"
                >
                  Subscribe Now & Boost Your BDS Preparation!
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Subcription;
