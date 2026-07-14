import React, { useEffect, useState } from "react";
import Footer from "../../component/Footer/Footer";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import environment from "../../enviroment";

import { Worker, Viewer } from "@react-pdf-viewer/core";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import { rotatePlugin } from "@react-pdf-viewer/rotate";
import { searchPlugin } from "@react-pdf-viewer/search";
import "@react-pdf-viewer/core/lib/styles/index.css";

import "swiper/css";
import "swiper/css/navigation";
import "./Chapterpdf.css";
import Service from "../serivce/service";

const Chapterpdf = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState({});
  const [videos, setVideos] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [dictionaryPdf, setDictionaryPdf] = useState(null);
  const [swiperRef, setSwiperRef] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Service.getChapterById(id);
        const chapterData = response?.data?.chapter || {};
        setChapter(chapterData);
        if (chapterData.pdfUrl) {
          setSelectedPdf(chapterData.pdfUrl);
        }
        if (chapterData.dictionaryUrl) {
          setDictionaryPdf(chapterData.dictionaryUrl);
        }

        const videoResponse = await axios.get(`${environment.endPoint}/api/v1/website/user/getAllVideosOfChapter/${id}`);
        setVideos(videoResponse?.data?.result?.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [id]);

  // Dynamically calculate slide index mapping
  let slideIndexCounter = 0;
  const pdfSlideIndex = chapter.pdfUrl ? slideIndexCounter++ : -1;
  const dictionarySlideIndex = chapter.dictionaryUrl ? slideIndexCounter++ : -1;
  const videosListSlideIndex = (videos && videos.length > 0) ? slideIndexCounter++ : -1;

  return (
    <>
      <div className="nav-slider md:w-[100%] w-[100%] text-sm mx-auto" style={{ padding: "0 20px", marginTop: "24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", paddingLeft: "15px", paddingRight: "15px" }}>
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
        </div>

        <div className="flex justify-center gap-8 flex-wrap">
          <div className="md:w-[100%] shadow-lg p-4 rounded-lg">
            <div className="py-2 flex gap-6 justify-center flex-wrap" style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
              {chapter.pdfUrl && (
                <button
                  className="inline-flex items-center rounded-md border bg-gray-800 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-900"
                  onClick={() => swiperRef?.slideTo(pdfSlideIndex)}
                  style={{
                    background: "#1f2937",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                >
                  Notes
                </button>
              )}
              {chapter.dictionaryUrl && (
                <button
                  className="inline-flex items-center rounded-md border bg-gray-800 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-900"
                  onClick={() => swiperRef?.slideTo(dictionarySlideIndex)}
                  style={{
                    background: "#1f2937",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                >
                  Dictionary
                </button>
              )}
              {videos && videos.length > 0 && (
                <button
                  className="inline-flex items-center rounded-md border bg-[#ef305c] px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
                  onClick={() => swiperRef?.slideTo(videosListSlideIndex)}
                  style={{
                    background: "#ef305c",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                >
                  Videos
                </button>
              )}
            </div>
          </div>
        </div>

        <Swiper 
          slidesPerView={1} 
          navigation={true} 
          modules={[Navigation]} 
          onSwiper={setSwiperRef}
          className="mySwiper"
        >
          {chapter.pdfUrl && (
            <SwiperSlide>
              <div className="flex justify-center">
                {selectedPdf && (
                  <PdfViewer
                    fileUrl={selectedPdf}
                    key="note-pdf-viewer"
                  />
                )}
              </div>
            </SwiperSlide>
          )}

          {chapter.dictionaryUrl && (
            <SwiperSlide>
              <div className="flex justify-center">
                {dictionaryPdf && (
                  <PdfViewer
                    fileUrl={dictionaryPdf}
                    key="dictionary-pdf-viewer"
                  />
                )}
              </div>
            </SwiperSlide>
          )}

          {videos && videos.length > 0 && (
            <SwiperSlide>
              <div style={{
                maxWidth: "600px",
                margin: "0 auto",
                padding: "30px 20px",
                background: "#fff",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                gap: "20px"
              }}>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#333", borderBottom: "2px solid #ef305c", paddingBottom: "8px", marginBottom: "10px" }}>
                  Chapter Videos
                </h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  {videos.map((video, index) => (
                    <div 
                      key={video._id}
                      onClick={() => setActiveVideo({ url: video.videoUrl, title: video.title || `Video ${index + 1}` })}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        cursor: "pointer",
                        padding: "12px",
                        borderRadius: "6px",
                        transition: "background 0.2s",
                        border: "1px solid #f0f0f0"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f9f9f9"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      {/* Red badge for "Video X :" */}
                      <span style={{
                        background: "#ef305c",
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        whiteSpace: "nowrap",
                        marginTop: "2px"
                      }}>
                        Video {index + 1} :
                      </span>
                      
                      {/* Clickable Heading text */}
                      <span style={{
                        fontSize: "1.05rem",
                        color: "#333",
                        fontWeight: "500",
                        wordBreak: "break-all",
                        whiteSpace: "normal",
                        flex: 1
                      }}>
                        {video.title || chapter.chapterName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>

      {/* Video Player Modal */}
      {activeVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4" style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "15px"
        }}>
          <div className="bg-[#111] text-white rounded-lg overflow-hidden max-w-4xl w-full shadow-2xl relative" style={{
            background: "#111",
            color: "white",
            borderRadius: "8px",
            overflow: "hidden",
            maxWidth: "800px",
            width: "100%",
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
            position: "relative"
          }}>
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white w-8 h-8 rounded-full flex items-center justify-center text-xl z-10"
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "rgba(255,255,255,0.1)",
                border: "none",
                color: "white",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                fontSize: "20px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10
              }}
            >
              &times;
            </button>

            <div className="p-4 bg-[#222] border-b border-white/10" style={{ padding: "15px", background: "#222", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <h3 className="font-bold text-lg" style={{ margin: 0 }}>{activeVideo.title}</h3>
            </div>

            <div className="relative aspect-video bg-black" style={{ position: "relative", backgroundColor: "black" }}>
              <video
                id="chapter-video-player"
                src={activeVideo.url}
                style={{ width: "100%", display: "block" }}
                controls
                autoPlay
              />
            </div>

            <div className="p-4 bg-[#222] flex items-center justify-between flex-wrap gap-4" style={{
              padding: "15px",
              background: "#222",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "15px"
            }}>
              <div className="flex gap-4" style={{ display: "flex", gap: "15px" }}>
                <button
                  onClick={() => {
                    const video = document.getElementById("chapter-video-player");
                    if (video) video.currentTime -= 10;
                  }}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "none",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "500",
                    fontSize: "14px"
                  }}
                >
                  ⏪ 10s
                </button>
                <button
                  onClick={() => {
                    const video = document.getElementById("chapter-video-player");
                    if (video) video.currentTime += 10;
                  }}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "none",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "500",
                    fontSize: "14px"
                  }}
                >
                  10s ⏩
                </button>
              </div>

              <div className="flex items-center gap-2" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span className="text-sm text-gray-400" style={{ color: "#aaa", fontSize: "14px" }}>Speed:</span>
                <select
                  onChange={(e) => {
                    const video = document.getElementById("chapter-video-player");
                    if (video) video.playbackRate = parseFloat(e.target.value);
                  }}
                  defaultValue="1"
                  style={{
                    background: "#333",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "4px",
                    padding: "6px 12px",
                    fontSize: "14px",
                    color: "white",
                    outline: "none"
                  }}
                >
                  <option value="0.5">0.5x</option>
                  <option value="0.75">0.75x</option>
                  <option value="1">1.0x (Normal)</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2.0x</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

const PdfViewer = ({ fileUrl }) => {
  const zoomPluginInstance = zoomPlugin();
  const rotatePluginInstance = rotatePlugin();
  const searchPluginInstance = searchPlugin();

  const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;
  const { RotateBackwardButton, RotateForwardButton } = rotatePluginInstance;
  const { ShowSearchPopoverButton } = searchPluginInstance;

  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user && user.phoneNumber) {
          setPhoneNumber(user.phoneNumber);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div
      style={{
        width: "100%",
        border: "1px solid black",
        height: "600px",
      }}
    >
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <div
          style={{
            border: "1px solid rgba(0, 0, 0, 0.3)",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <div
            style={{
              alignItems: "center",
              backgroundColor: "#eeeeee",
              borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
              display: "flex",
              justifyContent: "center",
              padding: "4px",
            }}
          >
            <RotateBackwardButton />
            <RotateForwardButton />
            <div style={{ flex: 1, overflow: "hidden" }} />
            <ShowSearchPopoverButton />
            <ZoomOutButton />
            <ZoomPopover />
            <ZoomInButton />
          </div>
          <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
            <Viewer fileUrl={fileUrl} plugins={[zoomPluginInstance, rotatePluginInstance, searchPluginInstance]} />

            {/* Watermark Overlay */}
            {phoneNumber && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  pointerEvents: "none",
                  zIndex: 9999,
                  overflow: "hidden",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "150px",
                  opacity: 0.06,
                }}
              >
                {Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      transform: "rotate(-45deg)",
                      fontSize: "2.2rem",
                      fontWeight: "bold",
                      color: "black",
                      whiteSpace: "nowrap",
                      userSelect: "none",
                    }}
                  >
                    {phoneNumber}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Worker>
    </div>
  );
};

export default Chapterpdf;
