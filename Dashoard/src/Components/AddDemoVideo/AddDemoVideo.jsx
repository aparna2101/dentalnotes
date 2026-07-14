import React, { useState, useEffect } from "react";
import "../AddProduct/AddProduct.css";
import upload_area from "../Assets/upload_area.svg";
import axios from "axios";
import { LoadingButton } from "@mui/lab";
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

const AddDemoVideo = () => {
  const [video, setVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  
  const [videoDetails, setVideoDetails] = useState({
    title: "",
    year: "",
    serialNumber: "",
    courseType: ""
  });

  const fetchVideos = async () => {
    try {
      const response = await axios.get("https://api.dentalnotesrep.com/api/v1/website/user/getAllDemoVideos");
      if (response.data.success || response.data.result) {
        setVideos(response.data.result.data || response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching videos", error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const changeHandler = (e) => {
    setVideoDetails({ ...videoDetails, [e.target.name]: e.target.value });
  };

  const handleVideoUpload = (e) => {
    setVideo(e.target.files[0]);
  };

  const addVideo = async (e) => {
    e.preventDefault();
    if (!videoDetails.title || !videoDetails.year) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      let formData = new FormData();
      formData.append("video", video);
      formData.append("title", videoDetails.title);
      formData.append("year", videoDetails.year);
      formData.append("serialNumber", videoDetails.serialNumber || "0");
      formData.append("courseType", videoDetails.courseType);

      const response = await axios.post(
        "https://api.dentalnotesrep.com/api/v1/website/user/addDemoVideo",
        formData
      );

      if (response.data.success) {
        toast.success("Demo Video Added Successfully");
        setVideoDetails({
          title: "",
          year: "",
          serialNumber: "",
          courseType: ""
        });
        setVideo(false);
        fetchVideos();
      }
    } catch (error) {
      console.error("Error adding video", error);
      toast.error("Failed to add demo video");
    } finally {
      setLoading(false);
    }
  };

  const deleteVideo = async (id) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        const response = await axios.delete(`https://api.dentalnotesrep.com/api/v1/website/user/deleteDemoVideo/${id}`);
        if (response.data.success) {
          toast.success("Video Deleted");
          fetchVideos();
        }
      } catch (error) {
        toast.error("Failed to delete video");
      }
    }
  };

  return (
    <div className="addproduct" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div className="add-video-form">
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>Add Demo Video</Typography>
        
        <div className="addproduct-itemfield">
          <p>Video Title</p>
          <input
            type="text"
            name="title"
            value={videoDetails.title}
            onChange={changeHandler}
            placeholder="Type here"
          />
        </div>


        <div className="addproduct-itemfield">
          <p>Year</p>
          <select
            name="year"
            value={videoDetails.year}
            onChange={changeHandler}
            className="add-product-selector"
          >
            <option value="">Select Year</option>
            <option value="1st">1st Year</option>
            <option value="2nd">2nd Year</option>
            <option value="3rd">3rd Year</option>
            <option value="4th">4th Year</option>
          </select>
        </div>

        <div className="addproduct-itemfield">
          <p>Course Type</p>
          <select
            name="courseType"
            value={videoDetails.courseType}
            onChange={changeHandler}
            className="add-product-selector"
          >
            <option value="">Select Course Type</option>
            <option value="Challenge">Detailed Course</option>
            <option value="Detailed">Crash Course</option>
          </select>
        </div>

        <div className="addproduct-itemfield">
          <p>Serial Number</p>
          <input
            type="number"
            name="serialNumber"
            value={videoDetails.serialNumber}
            onChange={changeHandler}
            placeholder="0"
          />
        </div>

        <div className="addproduct-itemfield">
          <p>Upload Video</p>
          <label htmlFor="video-input">
            <div style={{ 
              width: '120px', 
              height: '120px', 
              border: '1px dashed #c3c3c3', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer',
              borderRadius: '8px',
              background: '#f9f9f9',
              overflow: 'hidden'
            }}>
              {video ? (
                <div style={{ textAlign: 'center', padding: '10px' }}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 1 }}>VIDEO SELECTED</Typography>
                  <Typography variant="caption" sx={{ fontSize: '10px', wordBreak: 'break-all' }}>{video.name}</Typography>
                </div>
              ) : (
                <img
                  src={upload_area}
                  style={{ width: '40px' }}
                  alt=""
                />
              )}
            </div>
          </label>
          <input
            type="file"
            onChange={handleVideoUpload}
            id="video-input"
            hidden
            accept="video/*"
          />
          {loading && (
            <Typography variant="body2" sx={{ mt: 1, color: "#ef305c", fontWeight: 'bold' }}>
              ⏳ Uploading large video... Please wait, this may take a few minutes.
            </Typography>
          )}
        </div>

        <LoadingButton
          onClick={addVideo}
          loading={loading}
          variant="contained"
          sx={{ 
            mt: 2, 
            bgcolor: "#ef305c", 
            color: "white",
            fontWeight: "bold",
            borderRadius: "12px",
            px: 4,
            py: 1,
            textTransform: "none",
            "&:hover": { bgcolor: "#d92650" } 
          }}
        >
          Add Video
        </LoadingButton>
      </div>

      <div className="video-list">
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Existing Demo Videos</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: '#f9f9f9' }}>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Course Type</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {videos && videos.length > 0 ? (
                videos.map((v) => (
                  <TableRow key={v._id}>
                    <TableCell>{v.title}</TableCell>
                    <TableCell>{v.year}</TableCell>
                    <TableCell>{v.courseType === "Challenge" ? "Detailed" : v.courseType === "Detailed" ? "Crash" : v.courseType || "N/A"}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => deleteVideo(v._id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">No videos found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default AddDemoVideo;
