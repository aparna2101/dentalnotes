import React, { useEffect, useState } from "react";
import axios from "axios";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import "./ManageSubscription.css";

const ManageSubscription = () => {
  const [video, setVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    subscription: {
      planName: "",
      price: "",
      durationInDays: "",
      features: [""],
      promoVideoUrl: "",
      descriptionPoints: [""],
    },
  });

  // Fetch Current Settings
  const fetchSettings = async () => {
    try {
      const response = await axios.get("https://api.dentalnotesrep.com/api/v1/website/user/getSetting");
      if (response.data.success && response.data.result.data.length > 0) {
        setSettings(response.data.result.data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch settings", error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("subscription", JSON.stringify(settings.subscription));
      if (video) {
        formData.append("video", video);
      }

      const response = await axios.post("https://api.dentalnotesrep.com/api/v1/website/user/settingOrg", formData);

      if (response.data.success) {
        toast.success("Subscription Page Updated Successfully!");
        fetchSettings();
        setVideo(false);
      }
    } catch (error) {
      toast.error("Failed to update subscription content");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manage-subscription">
      <h2 className="page-title">Manage Subscription Page</h2>
      <p className="page-subtitle">Configure the promo video for your payment page</p>

      {/* Video Upload Section */}
      <div className="form-section">
        <h3>🎥 Subscription Promo Video</h3>
        <p className="field-desc">Upload a video that users can watch before paying.</p>
        <div className="input-field">
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
            className="file-input"
          />
          {settings.subscription?.promoVideoUrl && !video && (
            <div className="status-badge">✅ Current Video Exists</div>
          )}
        </div>
      </div>

      <div className="submit-section">
        <LoadingButton
          onClick={handleUpdate}
          loading={loading}
          variant="contained"
          className="save-btn"
        >
          Update Subscription Page
        </LoadingButton>
      </div>
    </div>
  );
};

export default ManageSubscription;
