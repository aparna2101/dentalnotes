import React, { useEffect, useState } from "react";
import Header from "../../component/Header/Header";
import Footer from "../../component/Footer/Footer";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import environment from "../../enviroment";
import { Box, Button, Typography } from "@mui/material";
import Service from "../serivce/service";
import { Modal, IconButton, Grid } from "@mui/material";




const NotesSubject = () => {
  const [subject, setSubject] = useState([]);
  const [demoVideos, setDemoVideos] = useState([]);
  const [bundlePrices, setBundlePrices] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null); // For the video modal

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const navigate = useNavigate();
  const isPremium = user?.isPremium === true || user?.isPremium === "true";
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedYear = queryParams.get("year");

  const [loading, setLoading] = useState(false);
  console.log(subject);

  async function fetchDataSubject() {
    setLoading(true); // Show loader
    // const response = await axios.get(
    //   `${environment.endPoint}/api/v1/website/user/getAllSubject`
    // );
    const response = await Service.getAllSubject(
      `/api/v1/website/user/getAllSubject`
    );

    setSubject(response?.data || []);
    setLoading(false); // Hide loader
  }

  async function fetchDemoVideos() {
    try {
      const response = await axios.get(`${environment.endPoint}/api/v1/website/user/getAllDemoVideos`);
      if (response.data.success || response.data.result) {
        setDemoVideos(response.data.result.data || response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching demo videos", error);
    }
  }

  async function fetchBundlePrices() {
    try {
      const response = await axios.get(`${environment.endPoint}/api/v1/website/user/getBundlePrices`);
      if (response.data.success || response.data.result) {
        setBundlePrices(response.data.result.data || response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching bundle prices", error);
    }
  }

  useEffect(() => {
    fetchDataSubject();
    fetchDemoVideos();
    fetchBundlePrices();
  }, []);

  subject?.sort((a, b) => {
    const aNum = a.serialNumber;
    const bNum = b.serialNumber;

    // Check for null, undefined, or 0 — they should come last
    const isANull = aNum === null || aNum === undefined || aNum === 0;
    const isBNull = bNum === null || bNum === undefined || bNum === 0;

    if (isANull && !isBNull) return 1; // a should come after b
    if (!isANull && isBNull) return -1; // a should come before b

    // If both are valid, sort normally
    return aNum - bNum;
  });

  const handleBuySubject = (data = {}) => {
    let paymentObject = {
      subscriptionType: "SubjectWise",
      redirectingTime: Date.now(),
      moduleInfo: {
        ...data.data,
      },
    };
    localStorage.setItem("payment", JSON.stringify(paymentObject));
    navigate("/subscription");
  };

  const handleBuyBundle = (year, courseType, price) => {
    let paymentObject = {
      subscriptionType: "Bundle",
      redirectingTime: Date.now(),
      moduleInfo: {
        year: year,
        courseType: courseType,
        price: price,
        subjectName: `All ${year} Year ${courseType} Subjects Bundle`
      },
    };
    localStorage.setItem("payment", JSON.stringify(paymentObject));
    navigate("/subscription");
  };




  const renderSubjectCard = (item) => (
    <Box
      key={item._id}
      sx={{
        width: {
          xs: "90%",
          sm: "46%",
          md: "30%",
          lg: "23%",
        },
        maxWidth: {
          xs: "340px",
          sm: "none",
        },
        mx: { xs: "auto", sm: 0 },
        transition: "all 0.3s",
      }}
    >
      <Box
        sx={{
          bgcolor: "white",
          border: "1px solid",
          borderColor: "indigo.200",
          borderRadius: 2,
          boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
          transition: "all 0.3s",
          "&:hover": {
            borderColor: "indigo.300",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 1.5,
          textAlign: "center",
          height: "100%",
        }}
      >
        <Box
          component="img"
          src={item.imageUrl}
          alt={item.subjectName}
          sx={{
            width: "100%",
            height: {
              xs: 150,
              sm: 130,
              md: 120,
              lg: 115,
            },
            objectFit: "cover",
            borderRadius: 1.5,
            mb: 1,
          }}
        />

        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflow: "hidden",
            width: "100%",
            mb: 0.25,
            height: "2.6rem",
            lineHeight: "1.3rem"
          }}
        >
          {item?.subjectName}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflow: "hidden",
            width: "100%",
            height: "2.2rem",
            lineHeight: "1.1rem",
            fontSize: "0.825rem"
          }}
        >
          {item?.description}
        </Typography>

        <Box sx={{ mt: "auto", pt: 0.75, width: "100%" }}>
          {item.isPurchased || isPremium ? (
            <Button
              component={Link}
              to={`/notessubject/${item?._id}`}
              variant="contained"
              sx={{
                backgroundColor: "indigo.600",
                "&:hover": { backgroundColor: "indigo.700" },
                borderRadius: "6px",
                px: 2.5,
                py: 0.7,
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.85rem",
                width: "100%"
              }}
            >
              Read More
            </Button>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.75,
                p: 0.5,
                borderRadius: 2,
                width: "100%"
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, color: "primary.main", fontSize: "0.9rem" }}
              >
                ₹{item.price}
              </Typography>

              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleBuySubject({ data: item })}
                sx={{
                  width: "100%",
                  maxWidth: 180,
                  borderRadius: "6px",
                  textTransform: "none",
                  fontWeight: 500,
                  py: 0.7,
                  fontSize: "0.85rem",
                }}
              >
                Buy Now
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );

  const renderVideoCard = (video) => (
    <Box
      key={video._id}
      onClick={() => setActiveVideo(video)}
      sx={{
        width: { xs: "100%", sm: "48%", md: "31%", lg: "23%" },
        cursor: "pointer",
        position: "relative",
        transition: "transform 0.3s",
        "&:hover": { transform: "scale(1.05)" },
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        bgcolor: "#000"
      }}
    >
      <Box sx={{ position: "relative", width: "100%", pt: "56.25%" }}>
        <video
          src={video.videoUrl}
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }}
        />
        <Box sx={{
          position: "absolute",
          top: 0, left: 0, width: "100%", height: "100%",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.2)"
        }}>
          <Typography sx={{ fontSize: "60px", color: "#fff", opacity: 0.9, lineHeight: 1 }}>▶</Typography>
        </Box>
      </Box>
      <Box sx={{ p: 1.5, bgcolor: "#fff" }}>
        <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#333", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {video.title}
        </Typography>
        <Typography variant="caption" sx={{ color: "#777" }}>Sample Video • {video.year} Year</Typography>
      </Box>
    </Box>
  );

  const challengeBundle = bundlePrices.find(b => b.year === selectedYear && b.courseType === "Challenge");
  const detailedBundle = bundlePrices.find(b => b.year === selectedYear && b.courseType === "Detailed");

  return (
    <>
      {loading && (
        <div className="">
          <div className=" w-full h-[400px] flex items-center justify-center bg-white bg-opacity-50 z-50">
            <div class="dot-spinner">
              <div class="dot-spinner__dot"></div>
              <div class="dot-spinner__dot"></div>
              <div class="dot-spinner__dot"></div>
              <div class="dot-spinner__dot"></div>
              <div class="dot-spinner__dot"></div>
              <div class="dot-spinner__dot"></div>
              <div class="dot-spinner__dot"></div>
              <div class="dot-spinner__dot"></div>
            </div>
          </div>
        </div>
      )}

      <Box sx={{ mx: "auto", maxWidth: "1200px", px: { xs: 2, sm: 4, lg: 6 }, mt: 4, mb: 4 }}>
        <button
          onClick={() => navigate(-1)}
          className="hidden md:inline-flex"
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
            alignItems: "center",
            marginBottom: "15px"
          }}
        >
          <span style={{ marginRight: '6px', fontSize: '1rem' }}>←</span> Back
        </button>

        {/* Centralized Demo Video Button - Removed as per subject-wise requirement */}
        {/* {demoVideos && demoVideos.length > 0 && (
          <Box sx={{ mb: 10, textAlign: "center", width: "100%" }}>
            ...
          </Box>
                {/* Challenge Course Section */}
        <Box sx={{ mb: 12 }}>
          <Typography variant="h6" sx={{ textAlign: "left", mb: 3, fontWeight: "bold", color: "#15803d", borderLeft: "5px solid #15803d", pl: 2, lineHeight: 1.2 }}>
            Detailed Course
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: { xs: "center", sm: "flex-start" },
              gap: 3,
              minHeight: "50px"
            }}
          >
            {subject?.filter(item => (!selectedYear || item.year === selectedYear) && item.courseType?.toLowerCase() === "challenge").length > 0 ? (
              subject
                ?.filter(item => (!selectedYear || item.year === selectedYear) && item.courseType?.toLowerCase() === "challenge")
                ?.sort((a, b) => (a.serialNumber || 0) - (b.serialNumber || 0))
                ?.map(renderSubjectCard)
            ) : (
              <Typography sx={{ color: "#999", fontStyle: "italic", ml: 1 }}>No subjects in Detailed Course yet.</Typography>
            )}
          </Box>

          {/* Demo Video for Challenge Course Section */}
          {demoVideos && demoVideos.find(v => v.courseType === "Challenge" && (!selectedYear || v.year === selectedYear)) && (
            <Box sx={{ mt: 6, textAlign: "center" }}>
              <Button
                onClick={() => setActiveVideo(demoVideos.find(v => v.courseType === "Challenge" && (!selectedYear || v.year === selectedYear)))}
                variant="contained"
                sx={{
                  backgroundColor: "#ef305c",
                  color: "#fff",
                  borderRadius: "12px",
                  px: 6,
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  "&:hover": { backgroundColor: "#1353fe" },
                  boxShadow: "0 4px 12px rgba(239, 48, 92, 0.3)"
                }}
              >
                Demo video for detailed course
              </Button>
            </Box>
          )}

          {/* Buy All Bundle Card for Challenge Course */}
          {subject?.some(item => (!selectedYear || item.year === selectedYear) && item.courseType?.toLowerCase() === "challenge" && !item.isPurchased) &&
            challengeBundle && (
              <Box 
                sx={{ 
                  mt: 3, 
                  mb: 2, 
                  p: 1.5, 
                  borderRadius: 2, 
                  bgcolor: "#f0fdf4", 
                  border: "1.5px dashed #16a34a", 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center", 
                  textAlign: "center",
                  maxWidth: "360px", 
                  width: "90%", 
                  mx: "auto", 
                  gap: 1 
                }}
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#15803d", fontSize: "0.95rem" }}>
                    🚀 Special Offer: Buy All {selectedYear} Year Detailed Course Subjects
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#555", fontSize: "0.75rem", mt: 0.5 }}>
                    {challengeBundle.description || "Get instant access to all subjects in this category at a discounted price!"}
                  </Typography>
                </Box>
                {challengeBundle.discount && (
                  <Box sx={{ width: "100%", my: 0.5 }}>
                    {/* Top line with star */}
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "70%", mx: "auto", mb: 0.5 }}>
                      <Box sx={{ flex: 1, height: "1px", bgcolor: "#fbbf24", opacity: 0.8 }} />
                      <Typography sx={{ color: "#fbbf24", mx: 0.75, fontSize: "0.8rem", lineHeight: 1 }}>★</Typography>
                      <Box sx={{ flex: 1, height: "1px", bgcolor: "#fbbf24", opacity: 0.8 }} />
                    </Box>
                    
                    {/* Text with sparkles */}
                    <Typography 
                      sx={{ 
                        fontWeight: "900", 
                        color: "#f59e0b", 
                        fontSize: "1.25rem", 
                        textAlign: "center",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        textShadow: "1px 1.5px 0px #92400e, 0px 2px 4px rgba(0,0,0,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.75
                      }}
                    >
                      <span style={{ color: "#fbbf24", fontSize: "0.85rem" }}>✦</span>
                      {challengeBundle.discount}
                      <span style={{ color: "#fbbf24", fontSize: "0.85rem" }}>✦</span>
                    </Typography>

                    {/* Bottom line */}
                    <Box sx={{ width: "70%", height: "1px", bgcolor: "#fbbf24", mx: "auto", mt: 0.5, opacity: 0.8 }} />
                  </Box>
                )}
                {challengeBundle.promoTag && (
                  <Box 
                    sx={{ 
                      display: "inline-flex", 
                      alignItems: "center", 
                      gap: 0.5, 
                      bgcolor: "#fef3c7", 
                      color: "#92400e", 
                      px: 1.5, 
                      py: 0.4, 
                      borderRadius: "50px", 
                      fontSize: "0.75rem", 
                      fontWeight: "bold",
                      mt: 0.5,
                      border: "1px solid #fde68a"
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block" }}>
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 15 14" />
                    </svg>
                    <span>{challengeBundle.promoTag}</span>
                  </Box>
                )}
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#15803d", mt: 0.5 }}>
                  ₹{challengeBundle.price}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => handleBuyBundle(selectedYear, "Challenge", challengeBundle.price)}
                  sx={{ bgcolor: "#15803d", "&:hover": { bgcolor: "#166534" }, px: 3, py: 0.6, borderRadius: "4px", fontWeight: "bold", textTransform: "none", fontSize: "0.8rem", width: "100%", maxWidth: "200px" }}
                >
                  Buy All Now
                </Button>
              </Box>
            )}
        </Box>


        {/* Detailed Course Section */}
        <Box sx={{ mb: 12 }}>
          <Typography variant="h6" sx={{ textAlign: "left", mb: 3, fontWeight: "bold", color: "#15803d", borderLeft: "5px solid #15803d", pl: 2, lineHeight: 1.2 }}>
            Crash Course
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: { xs: "center", sm: "flex-start" },
              gap: 3,
              minHeight: "50px"
            }}
          >
            {subject?.filter(item => (!selectedYear || item.year === selectedYear) && item.courseType?.toLowerCase() === "detailed").length > 0 ? (
              subject
                ?.filter(item => (!selectedYear || item.year === selectedYear) && item.courseType?.toLowerCase() === "detailed")
                ?.sort((a, b) => (a.serialNumber || 0) - (b.serialNumber || 0))
                ?.map(renderSubjectCard)
            ) : (
              <Typography sx={{ color: "#999", fontStyle: "italic", ml: 1 }}>No subjects in Crash Course yet.</Typography>
            )}
          </Box>

          {/* Demo Video for Detailed Course Section */}
          {demoVideos && demoVideos.find(v => v.courseType === "Detailed" && (!selectedYear || v.year === selectedYear)) && (
            <Box sx={{ mt: 6, textAlign: "center" }}>
              <Button
                onClick={() => setActiveVideo(demoVideos.find(v => v.courseType === "Detailed" && (!selectedYear || v.year === selectedYear)))}
                variant="contained"
                sx={{
                  backgroundColor: "#1353fe",
                  color: "#fff",
                  borderRadius: "12px",
                  px: 6,
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  "&:hover": { backgroundColor: "#ef305c" },
                  boxShadow: "0 4px 12px rgba(19, 83, 254, 0.3)"
                }}
              >
                Demo video for crash course
              </Button>
            </Box>
          )}

          {/* Buy All Bundle Card for Detailed Course */}
          {subject?.some(item => (!selectedYear || item.year === selectedYear) && item.courseType?.toLowerCase() === "detailed" && !item.isPurchased) &&
            detailedBundle && (
              <Box 
                sx={{ 
                  mt: 3, 
                  mb: 2, 
                  p: 1.5, 
                  borderRadius: 2, 
                  bgcolor: "#f0f7ff", 
                  border: "1.5px dashed #1d4ed8", 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center", 
                  textAlign: "center",
                  maxWidth: "360px", 
                  width: "90%", 
                  mx: "auto", 
                  gap: 1 
                }}
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#1d4ed8", fontSize: "0.95rem" }}>
                    🌟 Special Offer: Buy All {selectedYear} Year Crash Course Subjects
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#555", fontSize: "0.75rem", mt: 0.5 }}>
                    {detailedBundle.description || "Get instant access to all detailed subjects at a discounted price!"}
                  </Typography>
                </Box>
                {detailedBundle.discount && (
                  <Box sx={{ width: "100%", my: 0.5 }}>
                    {/* Top line with star */}
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "70%", mx: "auto", mb: 0.5 }}>
                      <Box sx={{ flex: 1, height: "1px", bgcolor: "#fbbf24", opacity: 0.8 }} />
                      <Typography sx={{ color: "#fbbf24", mx: 0.75, fontSize: "0.8rem", lineHeight: 1 }}>★</Typography>
                      <Box sx={{ flex: 1, height: "1px", bgcolor: "#fbbf24", opacity: 0.8 }} />
                    </Box>
                    
                    {/* Text with sparkles */}
                    <Typography 
                      sx={{ 
                        fontWeight: "900", 
                        color: "#f59e0b", 
                        fontSize: "1.25rem", 
                        textAlign: "center",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        textShadow: "1px 1.5px 0px #92400e, 0px 2px 4px rgba(0,0,0,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.75
                      }}
                    >
                      <span style={{ color: "#fbbf24", fontSize: "0.85rem" }}>✦</span>
                      {detailedBundle.discount}
                      <span style={{ color: "#fbbf24", fontSize: "0.85rem" }}>✦</span>
                    </Typography>

                    {/* Bottom line */}
                    <Box sx={{ width: "70%", height: "1px", bgcolor: "#fbbf24", mx: "auto", mt: 0.5, opacity: 0.8 }} />
                  </Box>
                )}
                {detailedBundle.promoTag && (
                  <Box 
                    sx={{ 
                      display: "inline-flex", 
                      alignItems: "center", 
                      gap: 0.5, 
                      bgcolor: "#fef3c7", 
                      color: "#92400e", 
                      px: 1.5, 
                      py: 0.4, 
                      borderRadius: "50px", 
                      fontSize: "0.75rem", 
                      fontWeight: "bold",
                      mt: 0.5,
                      border: "1px solid #fde68a"
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block" }}>
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 15 14" />
                    </svg>
                    <span>{detailedBundle.promoTag}</span>
                  </Box>
                )}
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1d4ed8", mt: 0.5 }}>
                  ₹{detailedBundle.price}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => handleBuyBundle(selectedYear, "Detailed", detailedBundle.price)}
                  sx={{ bgcolor: "#1d4ed8", "&:hover": { bgcolor: "#1e40af" }, px: 3, py: 0.6, borderRadius: "4px", fontWeight: "bold", textTransform: "none", fontSize: "0.8rem", width: "100%", maxWidth: "200px" }}
                >
                  Buy All Now
                </Button>
              </Box>
            )}
        </Box>


        {/* Fallback for subjects without course type */}
        {subject?.filter(item => (!selectedYear || item.year === selectedYear) && !item.courseType).length > 0 && (
          <Box sx={{ mt: 10 }}>
            <Typography variant="h4" sx={{ textAlign: "left", mb: 5, fontWeight: "bold", color: "#666", borderLeft: "10px solid #666", pl: 3, lineHeight: 1.2 }}>
              General Course / Other Subjects
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: { xs: "center", sm: "flex-start" },
                gap: 3,
              }}
            >
              {subject
                ?.filter(item => (!selectedYear || item.year === selectedYear) && !item.courseType)
                ?.sort((a, b) => (a.serialNumber || 0) - (b.serialNumber || 0))
                ?.map(renderSubjectCard)}
            </Box>
          </Box>
        )}
        {/* Full Year Mega Bundle Card at the Bottom */}
        {subject?.some(item => (!selectedYear || item.year === selectedYear) && !item.isPurchased) &&
          bundlePrices.find(b => b.year === selectedYear && b.courseType === "Full") && (
            <Box sx={{ mt: 8, mb: 4, p: 4, borderRadius: 4, bgcolor: "#f9f1ff", border: "3px dashed #673ab7", display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: "center", justifyContent: "space-between", gap: 2 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#673ab7" }}>
                  💎 Full {selectedYear} Year Mega Bundle
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#444" }}>
                  Unlock EVERYTHING: Detailed Course + Crash Course
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", mt: 1 }}>
                  {bundlePrices.find(b => b.year === selectedYear && b.courseType === "Full")?.description || "Get instant access to all subjects in both categories for the entire year!"}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#673ab7", mb: 1 }}>
                  ₹{bundlePrices.find(b => b.year === selectedYear && b.courseType === "Full")?.price}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => handleBuyBundle(selectedYear, "Full", bundlePrices.find(b => b.year === selectedYear && b.courseType === "Full")?.price)}
                  sx={{ bgcolor: "#673ab7", "&:hover": { bgcolor: "#5e35b1" }, px: 6, py: 1.5, borderRadius: "12px", fontWeight: "bold", textTransform: "none", fontSize: "1rem" }}
                >
                  Buy Full Year Now
                </Button>
              </Box>
            </Box>
          )}
      </Box>

      {/* Premium Video Modal */}
      <Modal
        open={!!activeVideo}
        onClose={() => setActiveVideo(null)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}
      >
        <Box sx={{
          position: 'relative',
          width: '100%',
          maxWidth: '900px',
          bgcolor: '#000',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 24px 48px rgba(0,0,0,0.5)'
        }}>
          <IconButton
            onClick={() => setActiveVideo(null)}
            sx={{ position: 'absolute', right: 12, top: 12, color: '#fff', zIndex: 10, bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
          >
            <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>✖</Typography>
          </IconButton>

          <Box sx={{ position: 'relative', pt: '56.25%' /* 16:9 Aspect Ratio */ }}>
            {activeVideo && (
              <video
                src={activeVideo.videoUrl}
                controls
                autoPlay
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              />
            )}
          </Box>

          <Box sx={{ p: 3, bgcolor: '#1a1a1a', color: '#fff' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{activeVideo?.title}</Typography>
            <Typography variant="body2" sx={{ color: '#aaa', mt: 0.5 }}>{activeVideo?.courseType} Course • {activeVideo?.year} Year</Typography>
          </Box>
        </Box>
      </Modal>

      <Footer />
    </>
  );
};

export default NotesSubject;
