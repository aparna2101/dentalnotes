// import React, { useEffect, useState } from "react";
// import "./AddProduct.css";
// import upload_area from "../Assets/upload_area.svg";
// import axios from "axios";

// import { LoadingButton } from "@mui/lab";
// import { Box } from "@mui/material";
// import { useParams } from "react-router-dom";
// import { toast } from "react-toastify";

// const OrgSettings = () => {
//   const [image, setImage] = useState(false);
//   // const [subjecName,setSubjectName]=useState(" ")
//   // const [descripton,setdescription]=useState(" ")

//   const [loading, setLoading] = useState(false);
//   const { id } = useParams();

//   const [productDetails, setProductDetails] = useState({
//     subjectName: "",
//     description: "",
//     imageUrl: "",
//   });

//   const changeHandler = (e) => {
//     debugger;
//     setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
//   };

//   const AddProduct = async (e) => {
//     try {
//       let dataObj;
//       let product = productDetails;
//       setLoading(true);
//       e.preventDefault();
//       debugger;
//       let formData = new FormData();
//       formData.append("image", image);
//       formData.append("subjectName", productDetails.subjectName);
//       formData.append("description", productDetails.description);
//       formData.append("serialNumber", String(productDetails.serialNumber));

//       const response = await axios.put(
//         `https://api.dentalnotesrep.com/api/v1/website/user/updateSubject/${id}`,
//         formData
//       );
//       if (response.data.success) {
//         toast.success("subject Updated");

//         setLoading(false);
//       }
//     } catch (error) {
//       setLoading(false);
//       console.log("error", error);
//       toast.error(error?.response?.data?.message || "Something went wrong");
//     }
//   };

//   async function FetchSubject() {
//     const response = await axios.get(
//       `https://api.dentalnotesrep.com/api/v1/website/user/getSubjectById/${id}`
//     );
//     setProductDetails({ ...response.data.result.data });
//   }

//   useEffect(() => {
//     FetchSubject();
//   }, [id]);

//   return (
//     <div className="addproduct">
//       <div className="addproduct-itemfield">
//         <p>Website Name</p>
//         <input
//           type="text"
//           name="subjectName"
//           value={productDetails.subjectName}
//           onChange={(e) => {
//             changeHandler(e);
//           }}
//           placeholder="Type here"
//         />
//       </div>



//       <div className="addproduct-itemfield">
//         <p>Subscription Price</p>
//         <input
//           type="text"
//           name="serialNumber"
//           value={productDetails.serialNumber}
//           onChange={(e) => {
//             changeHandler(e);
//           }}
//           placeholder="Type here"
//         />
//       </div>

//       <div
//         className="addproduct-itemfield"
//         style={{ marginTop: "20px", marginBottom: "20px" }}
//       >
//         <p>Subject Small Description</p>
//         <input
//           type="text"
//           name="description"
//           value={productDetails.description}
//           onChange={(e) => {
//             changeHandler(e);
//           }}
//           placeholder="Type here"
//         />
//       </div>

//       <div className="addproduct-itemfield" style={{ marginBottom: "20px" }}>
//         <p>Subject Image</p>
//         <label htmlFor="file-input">
//           <img
//             className="addproduct-thumbnail-img"
//             src={
//               !image
//                 ? productDetails.imageUrl
//                   ? productDetails.imageUrl
//                   : upload_area
//                 : URL.createObjectURL(image)
//             }
//             alt=""
//           />
//         </label>
//         <input
//           onChange={(e) => setImage(e.target.files[0])}
//           type="file"
//           name="image"
//           multiple
//           id="file-input"
//           accept="image/*"
//           hidden
//         />
//         <span style={{ marginLeft: "20px" }}>Only png & jpeg allow</span>
//       </div>

//       {/* <button className="addproduct-btn" type="submit" onClick={e=>AddProduct(e)}>
//         ADD
//       </button> */}

//       <LoadingButton
//         onClick={(e) => AddProduct(e)}
//         type="submit"
//         loading={loading}
//         variant="contained"
//         color="primary"
//         disabled={loading}
//       >
//         {loading ? "Loading..." : "Edit Subject"}
//       </LoadingButton>
//     </div>
//   );
// };

// export default OrgSettings;



import React, { useEffect, useState } from "react";
import "./AddProduct.css";
import upload_area from "../Assets/upload_area.svg";
import axios from "axios";
import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/material";
import { toast } from "react-toastify";

const OrgSettings = () => {
  const [image, setImage] = useState(false);
  const [video, setVideo] = useState(false);
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    companyName: "",
    contactEmail: "",
    logo: {
      url: "",
      public_id: "",
    },
    subscription: {
      planName: "",
      price: "",
      durationInDays: "",
      features: [""],
      promoVideoUrl: "",
      descriptionPoints: [""],
    },
  });

  // 🔹 Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Handle Subscription Change
  const handleSubscriptionChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      subscription: { ...prev.subscription, [name]: value },
    }));
  };

  // 🔹 Fetch Settings
  const fetchSettings = async () => {
    try {
      debugger
      const response = await axios.get(
        "https://api.dentalnotesrep.com/api/v1/website/user/getSetting"
      );
      if (response.data.success) {
        setSettings(response.data?.result?.data[0]);
      }
    } catch (error) {
      toast.error("Failed to fetch settings");
      console.error(error);
    }
  };

  // 🔹 Update Settings
  const updateSettings = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("companyName", settings?.companyName);
      formData.append("contactEmail", settings?.contactEmail);
      formData.append("subscription", JSON.stringify(settings?.subscription));

      if (image) {
        formData.append("image", image);
      }
      if (video) {
        formData.append("video", video);
      }

      const response = await axios.post(
        "https://api.dentalnotesrep.com/api/v1/website/user/settingOrg",
        formData
      );

      if (response.data.success) {
        toast.success("Settings updated successfully");
        fetchSettings();
      } else {
        toast.error(response.data.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchSettings();
  }, []);


  useEffect(()=>{
    console.log("Your setting data",settings)
  },[])
  return (
    <div className="addproduct">
      <h2 className="page-title">Organization Settings</h2>

      {/* Company Name */}
      <div className="addproduct-itemfield">
        <p>Company Name</p>
        <input
          type="text"
          name="companyName"
          value={settings?.companyName}
          onChange={handleChange}
          placeholder="Enter company name"
        />
      </div>

      {/* Contact Email */}
      <div className="addproduct-itemfield">
        <p>Contact Email</p>
        <input
          type="email"
          name="contactEmail"
          value={settings?.contactEmail}
          onChange={handleChange}
          placeholder="Enter contact email"
        />
      </div>

      {/* Subscription Fields */}
      <div className="addproduct-itemfield">
        <p>Plan Name</p>
        <input
          type="text"
          name="planName"
          value={settings?.subscription?.planName}
          onChange={handleSubscriptionChange}
          placeholder="Enter plan name"
        />
      </div>

      <div className="addproduct-itemfield">
        <p>Subscription Price</p>
        <input
          type="number"
          name="price"
          value={settings?.subscription?.price}
          onChange={handleSubscriptionChange}
          placeholder="Enter price"
        />
      </div>

      <div className="addproduct-itemfield">
        <p>Duration (in days)</p>
        <input
          type="number"
          name="durationInDays"
          value={settings?.subscription?.durationInDays}
          onChange={handleSubscriptionChange}
          placeholder="Enter duration"
        />
      </div>

      <div className="addproduct-itemfield">
        <p>Features (comma separated)</p>
        <input
          type="text"
          name="features"
          value={settings?.subscription?.features?.join(", ")}
          onChange={(e) =>
            setSettings((prev) => ({
              ...prev,
              subscription: {
                ...prev.subscription,
                features: e.target.value.split(",").map((f) => f.trim()),
              },
            }))
          }
          placeholder="Enter features separated by commas"
        />
      </div>

      {/* Logo Upload */}
      <div className="addproduct-itemfield" style={{ marginBottom: "20px" }}>
        <p>Company Logo</p>
        <label htmlFor="file-input">
          <img
            className="addproduct-thumbnail-img"
            src={
              !image
                ? settings?.logo?.url
                  ? settings?.logo.url
                  : upload_area
                : URL.createObjectURL(image)
            }
            alt="logo"
          />
        </label>
        <input
          onChange={(e) => setImage(e.target.files[0])}
          type="file"
          name="logo"
          id="file-input"
          accept="image/*"
          hidden
        />
        <span style={{ marginLeft: "20px" }}>Only png & jpeg allowed</span>
      </div>

      <LoadingButton
        onClick={updateSettings}
        type="submit"
        loading={loading}
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Settings"}
      </LoadingButton>
    </div>
  );
};

export default OrgSettings;
