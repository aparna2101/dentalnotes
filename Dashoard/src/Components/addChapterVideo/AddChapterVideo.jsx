import React, { useState, useEffect } from "react";
import "../AddProduct/AddProduct.css";
import upload_area from "../Assets/upload_area.svg";
import axios from "axios";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";

const AddChapterVideo = () => {
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [videos, setVideos] = useState([]);
  const [allVideos, setAllVideos] = useState([]);

  const [selectedYear, setSelectedYear] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedChapterId, setSelectedChapterId] = useState("");

  const [videoFile, setVideoFile] = useState(null);
  const [videoName, setVideoName] = useState(null);
  const [videoTitle, setVideoTitle] = useState("");

  // Video Preview Modal State
  const [previewVideo, setPreviewVideo] = useState(null);

  // Video Inline Editing State
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingFile, setEditingFile] = useState(null);
  const [editingFileName, setEditingFileName] = useState("");

  // Fetch all subjects
  async function fetchSubjects() {
    try {
      const response = await axios.get(
        "https://api.dentalnotesrep.com/api/v1/website/user/getAllSubject"
      );
      setSubjects(response.data.result.data || []);
    } catch (error) {
      toast.error("Failed to fetch subjects");
    }
  }

  // Fetch all chapter videos in database
  async function fetchAllVideos() {
    try {
      const response = await axios.get(
        "https://api.dentalnotesrep.com/api/v1/website/user/getAllChapterVideos"
      );
      setAllVideos(response.data.result.data || []);
    } catch (error) {
      console.error("Failed to fetch all videos", error);
    }
  }

  // Fetch chapters of selected subject
  async function fetchChapters(subjectId) {
    if (!subjectId) {
      setChapters([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://api.dentalnotesrep.com/api/v1/website/user/getAllChapterOfSubject/${subjectId}`
      );
      setChapters(response.data.result.data?.chapters || []);
    } catch (error) {
      toast.error("Failed to fetch chapters for this subject");
    }
  }

  // Fetch current videos of selected chapter
  async function fetchVideos(chapterId) {
    if (!chapterId) {
      setVideos([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://api.dentalnotesrep.com/api/v1/website/user/getAllVideosOfChapter/${chapterId}`
      );
      setVideos(response.data.result.data || []);
    } catch (error) {
      toast.error("Failed to fetch videos of this chapter");
    }
  }

  // Upload video handler
  const handleUploadVideo = async () => {
    if (!selectedChapterId) {
      toast.warning("Please select a chapter first");
      return;
    }
    if (!videoTitle.trim()) {
      toast.warning("Please enter a Video Heading / Title");
      return;
    }
    if (!videoFile) {
      toast.warning("Please select a video file to upload");
      return;
    }

    try {
      setLoading(true);
      let formData = new FormData();
      formData.append("chapterId", selectedChapterId);
      formData.append("videoUrl", videoFile);
      formData.append("title", videoTitle);

      const response = await axios.post(
        "https://api.dentalnotesrep.com/api/v1/website/user/createChapterVideo",
        formData
      );

      if (response.data.result.success) {
        toast.success("Video uploaded successfully");
        setVideoFile(null);
        setVideoName(null);
        setVideoTitle("");
        // Refresh video lists
        fetchVideos(selectedChapterId);
        fetchAllVideos();
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      const errorMsg = error?.response?.data?.message || "Something went wrong during upload";
      toast.error(errorMsg);
    }
  };

  // Update video handler (Supports title and replacing video file)
  const handleUpdateVideo = async (videoId) => {
    if (!editingTitle.trim()) {
      toast.warning("Title cannot be empty");
      return;
    }
    try {
      setLoading(true);
      let formData = new FormData();
      formData.append("title", editingTitle);
      if (editingFile) {
        formData.append("videoUrl", editingFile);
      }

      const response = await axios.put(
        `https://api.dentalnotesrep.com/api/v1/website/user/updateChapterVideo/${videoId}`,
        formData
      );
      if (response.data.result.success) {
        toast.success("Video updated successfully");
        setEditingVideoId(null);
        setEditingTitle("");
        setEditingFile(null);
        setEditingFileName("");
        // Refresh lists
        fetchVideos(selectedChapterId);
        fetchAllVideos();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to update video");
    }
  };

  // Delete video handler
  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) {
      return;
    }
    try {
      const response = await axios.delete(
        `https://api.dentalnotesrep.com/api/v1/website/user/deleteChapterVideo/${videoId}`
      );
      if (response.data.result.success) {
        toast.success("Video deleted successfully");
        // Refresh video lists
        fetchVideos(selectedChapterId);
        fetchAllVideos();
      }
    } catch (error) {
      toast.error("Failed to delete video");
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchAllVideos();
  }, []);

  // When year or subject changes, reset child dropdowns
  const handleYearChange = (year) => {
    setSelectedYear(year);
    setSelectedSubjectId("");
    setSelectedChapterId("");
    setChapters([]);
    setVideos([]);
  };

  const handleSubjectChange = (subjectId) => {
    setSelectedSubjectId(subjectId);
    setSelectedChapterId("");
    setVideos([]);
    fetchChapters(subjectId);
  };

  const handleChapterChange = (chapterId) => {
    setSelectedChapterId(chapterId);
    fetchVideos(chapterId);
  };

  return (
    <div className="addproduct" style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
      <div>
        <h3>Add Chapter Video</h3>
        <hr style={{ margin: "15px 0", borderColor: "#eee" }} />

        {/* Select Year */}
        <div className="addproduct-itemfield">
          <p>Select Year</p>
          <select
            value={selectedYear}
            onChange={(e) => handleYearChange(e.target.value)}
            className="add-product-selector"
            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #c3c3c3" }}
          >
            <option value="">All Years</option>
            <option value="1st">1st Year</option>
            <option value="2nd">2nd Year</option>
            <option value="3rd">3rd Year</option>
            <option value="4th">4th Year</option>
          </select>
        </div>

        {/* Select Subject */}
        <div className="addproduct-itemfield">
          <p>Search Subject Name</p>
          <input
            type="text"
            placeholder="Type to search subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #c3c3c3", marginBottom: "10px" }}
          />
          <p>Select Subject</p>
          <select
            value={selectedSubjectId}
            className="add-product-selector"
            onChange={(e) => handleSubjectChange(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #c3c3c3" }}
          >
            <option value="">Select Subject</option>
            {subjects
              .filter(subject => (!selectedYear || subject.year === selectedYear))
              .filter(subject => (!searchTerm || subject.subjectName.toLowerCase().includes(searchTerm.toLowerCase())))
              .map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.subjectName} {subject.year ? `(${subject.year} Year)` : ""}
                </option>
              ))}
          </select>
        </div>

        {/* Select Chapter */}
        <div className="addproduct-itemfield">
          <p>Select Chapter</p>
          <select
            value={selectedChapterId}
            className="add-product-selector"
            onChange={(e) => handleChapterChange(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #c3c3c3" }}
            disabled={!selectedSubjectId}
          >
            <option value="">Select Chapter</option>
            {chapters.map((chapter, index) => (
              <option key={chapter._id} value={chapter._id}>
                Chapter {index + 1}: {chapter.chapterName}
              </option>
            ))}
          </select>
        </div>

        {/* Upload Video Block */}
        {selectedChapterId && (
          <>
            <div className="addproduct-itemfield" style={{ marginTop: "20px" }}>
              <p>Video Heading / Title (Required)</p>
              <input
                type="text"
                placeholder="Type video heading (e.g. My topic)..."
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #c3c3c3", marginBottom: "15px" }}
              />

              <p>Upload Video File</p>
              <label htmlFor="file-input-video">
                <img
                  className="addproduct-thumbnail-img"
                  src={upload_area}
                  alt="Upload"
                  style={{ cursor: "pointer", width: "120px" }}
                />
              </label>
              <input
                type="file"
                onChange={(e) => {
                  setVideoFile(e.target.files[0]);
                  setVideoName(e.target.files[0].name);
                }}
                name="videoUrl"
                id="file-input-video"
                accept="video/*"
                hidden
              />
              {videoName && (
                <p style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
                  Selected Video: <strong>{videoName}</strong>
                </p>
              )}

              <LoadingButton
                onClick={handleUploadVideo}
                loading={loading}
                variant="contained"
                color="primary"
                disabled={loading || !videoFile}
                sx={{ my: 2, display: "block" }}
              >
                Upload Video
              </LoadingButton>
            </div>

            {/* List of currently uploaded videos for this chapter */}
            <div style={{ marginTop: "30px" }}>
              <h4>Videos in this Chapter ({videos.length})</h4>
              {videos.length === 0 ? (
                <p style={{ fontSize: "14px", color: "#888", marginTop: "10px" }}>No videos uploaded for this chapter yet.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px" }}>
                  {videos.map((vid, idx) => (
                    <div 
                      key={vid._id} 
                      style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center", 
                        padding: "10px 15px", 
                        border: "1px solid #ddd", 
                        borderRadius: "6px",
                        background: "#fafafa" 
                      }}
                    >
                      {editingVideoId === vid._id ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "10px", border: "1px solid #ffc107", borderRadius: "6px", background: "#fffbeb", width: "100%" }}>
                          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <span style={{ fontWeight: "bold", color: "#666", minWidth: "80px" }}>Edit Title:</span>
                            <input 
                              type="text" 
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              style={{ padding: "6px 10px", fontSize: "14px", border: "1px solid #ccc", borderRadius: "4px", flex: 1 }}
                            />
                          </div>
                          
                          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <span style={{ fontWeight: "bold", color: "#666", minWidth: "80px" }}>Replace Video:</span>
                            <input 
                              type="file" 
                              accept="video/*"
                              onChange={(e) => {
                                setEditingFile(e.target.files[0]);
                                setEditingFileName(e.target.files[0].name);
                              }}
                              style={{ fontSize: "13px" }}
                            />
                            {editingFileName && (
                              <span style={{ fontSize: "12px", color: "#28a745" }}>({editingFileName})</span>
                            )}
                          </div>

                          <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
                            <LoadingButton 
                              onClick={() => handleUpdateVideo(vid._id)}
                              loading={loading}
                              variant="contained"
                              color="success"
                              size="small"
                              sx={{ textTransform: "none" }}
                            >
                              Save Changes
                            </LoadingButton>
                            <button 
                              onClick={() => {
                                setEditingVideoId(null);
                                setEditingTitle("");
                                setEditingFile(null);
                                setEditingFileName("");
                              }}
                              style={{ padding: "6px 12px", background: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px" }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: "15px", flex: 1, minWidth: 0 }}>
                            <span style={{ fontWeight: "bold", color: "#666", whiteSpace: "nowrap", marginTop: "2px" }}>Video {idx + 1}</span>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", flex: 1, minWidth: 0, flexWrap: "wrap" }}>
                              <span style={{ color: "#333", fontSize: "14px", wordBreak: "break-all", whiteSpace: "normal" }}>: {vid.title || "No Title"}</span>
                              <button 
                                onClick={() => setPreviewVideo({ url: vid.videoUrl, title: vid.title || `Video ${idx + 1}` })}
                                style={{ padding: "2px 8px", background: "#17a2b8", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "11px", fontWeight: "bold", whiteSpace: "nowrap" }}
                              >
                                ▶ Play
                              </button>
                            </div>
                          </div>
                          
                          <div style={{ display: "flex", gap: "10px" }}>
                            <button 
                              onClick={() => {
                                setEditingVideoId(vid._id);
                                setEditingTitle(vid.title || "");
                                setEditingFile(null);
                                setEditingFileName("");
                              }}
                              style={{ 
                                background: "#ffc107", 
                                color: "#212529", 
                                border: "none", 
                                padding: "6px 12px", 
                                borderRadius: "4px", 
                                cursor: "pointer",
                                fontSize: "13px",
                                fontWeight: "bold"
                              }}
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteVideo(vid._id)}
                              style={{ 
                                background: "#ff4d4f", 
                                color: "white", 
                                border: "none", 
                                padding: "6px 12px", 
                                borderRadius: "4px", 
                                cursor: "pointer",
                                fontSize: "13px" 
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Global List of All Uploaded Videos across all chapters */}
      <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: "2px solid #f0f0f0" }}>
        <h3 style={{ marginBottom: "15px", fontWeight: "bold" }}>All Uploaded Chapter Videos ({allVideos.length})</h3>
        {allVideos.length === 0 ? (
          <p style={{ fontSize: "14px", color: "#888" }}>No videos uploaded yet.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #dee2e6" }}>
                  <th style={{ padding: "12px 15px", fontWeight: "bold" }}>Year</th>
                  <th style={{ padding: "12px 15px", fontWeight: "bold" }}>Subject</th>
                  <th style={{ padding: "12px 15px", fontWeight: "bold" }}>Chapter</th>
                  <th style={{ padding: "12px 15px", fontWeight: "bold" }}>Video Heading</th>
                  <th style={{ padding: "12px 15px", fontWeight: "bold" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {allVideos.map((vid) => {
                  const chName = vid.chapterId?.chapterName || "N/A";
                  const subName = vid.chapterId?.subjectId?.subjectName || "N/A";
                  const yearName = vid.chapterId?.subjectId?.year || "N/A";
                  return (
                    <tr key={vid._id} style={{ borderBottom: "1px solid #dee2e6" }}>
                      <td style={{ padding: "12px 15px" }}>{yearName} Year</td>
                      <td style={{ padding: "12px 15px" }}>{subName}</td>
                      <td style={{ padding: "12px 15px" }}>{chName}</td>
                      <td style={{ padding: "12px 15px", maxWidth: "250px", wordBreak: "break-all" }}>
                        {editingVideoId === vid._id ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "10px", border: "1px solid #ffc107", borderRadius: "6px", background: "#fffbeb" }}>
                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                              <span style={{ fontWeight: "bold", fontSize: "12px" }}>Title:</span>
                              <input 
                                type="text" 
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                style={{ padding: "4px 8px", fontSize: "14px", border: "1px solid #ccc", borderRadius: "4px" }}
                              />
                            </div>
                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                              <span style={{ fontWeight: "bold", fontSize: "12px" }}>Replace:</span>
                              <input 
                                type="file" 
                                accept="video/*"
                                onChange={(e) => {
                                  setEditingFile(e.target.files[0]);
                                  setEditingFileName(e.target.files[0].name);
                                }}
                                style={{ fontSize: "12px" }}
                              />
                            </div>
                            <div style={{ display: "flex", gap: "8px", marginTop: "5px" }}>
                              <LoadingButton 
                                onClick={() => handleUpdateVideo(vid._id)}
                                loading={loading}
                                variant="contained"
                                color="success"
                                size="small"
                                sx={{ textTransform: "none" }}
                              >
                                Save
                              </LoadingButton>
                              <button 
                                onClick={() => {
                                  setEditingVideoId(null);
                                  setEditingTitle("");
                                  setEditingFile(null);
                                  setEditingFileName("");
                                }}
                                style={{ padding: "4px 10px", background: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", flexWrap: "wrap" }}>
                            <strong style={{ fontSize: "14px", wordBreak: "break-all", whiteSpace: "normal", display: "inline-block" }}>{vid.title}</strong>
                            <button 
                              onClick={() => setPreviewVideo({ url: vid.videoUrl, title: vid.title })}
                              style={{ padding: "2px 8px", background: "#17a2b8", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "11px", fontWeight: "bold", whiteSpace: "nowrap" }}
                            >
                              ▶ Play
                            </button>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "12px 15px" }}>
                        {editingVideoId !== vid._id && (
                          <div style={{ display: "flex", gap: "10px" }}>
                            <button 
                              onClick={() => {
                                setEditingVideoId(vid._id);
                                setEditingTitle(vid.title || "");
                                setEditingFile(null);
                                setEditingFileName("");
                              }}
                              style={{ 
                                background: "#ffc107", 
                                color: "#212529", 
                                border: "none", 
                                padding: "6px 12px", 
                                borderRadius: "4px", 
                                cursor: "pointer",
                                fontSize: "13px",
                                fontWeight: "bold"
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteVideo(vid._id)}
                              style={{
                                background: "#ff4d4f",
                                color: "white",
                                border: "none",
                                padding: "6px 12px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "13px"
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Video Preview Modal overlay */}
      {previewVideo && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 99999,
          padding: "20px"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "8px",
            maxWidth: "700px",
            width: "100%",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            overflow: "hidden",
            position: "relative",
            display: "flex",
            flexDirection: "column"
          }}>
            <div style={{
              padding: "15px 20px",
              borderBottom: "1px solid #eee",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#f8f9fa"
            }}>
              <h4 style={{ margin: 0, fontWeight: "bold", fontSize: "1.1rem" }}>{previewVideo.title}</h4>
              <button 
                onClick={() => setPreviewVideo(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#aaa"
                }}
              >
                &times;
              </button>
            </div>
            <div style={{ padding: "10px", background: "#000" }}>
              <video 
                src={previewVideo.url} 
                controls 
                autoPlay 
                style={{ width: "100%", display: "block" }} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddChapterVideo;
