import React, { useEffect, useState } from "react";
import "./AddProduct.css";
import upload_area from "../Assets/upload_area.svg";
import axios from "axios";

import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const AddProduct = () => {
  const [image, setImage] = useState(false);
  // const [subjecName,setSubjectName]=useState(" ")
  // const [descripton,setdescription]=useState(" ")

  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const [productDetails, setProductDetails] = useState({
    subjectName: "",
    description: "",
    imageUrl: "",
    year: "",
    courseType: ""
  });

  const changeHandler = (e) => {
    debugger;
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const AddProduct = async (e) => {
    try {
      let dataObj;
      let product = productDetails;
      setLoading(true);
      e.preventDefault();
      debugger;
      let formData = new FormData();
      formData.append("image", image);
      formData.append("subjectName", productDetails.subjectName);
      formData.append("description", productDetails.description);
      formData.append("serialNumber", String(productDetails.serialNumber));
      formData.append("year", productDetails.year);
      formData.append("courseType", productDetails.courseType);
      formData.append("price", String(productDetails.price));

      const response = await axios.put(
        `https://api.dentalnotesrep.com/api/v1/website/user/updateSubject/${id}`,
        formData
      );
      if (response.data.success) {
        toast.success("subject Updated");

        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log("error", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  async function FetchSubject() {
    const response = await axios.get(
      `https://api.dentalnotesrep.com/api/v1/website/user/getSubjectById/${id}`
    );
    setProductDetails({ ...response.data.result.data });
  }

  useEffect(() => {
    FetchSubject();
  }, [id]);

  return (
    <div className="addproduct">


      <div className="addproduct-itemfield">
        <p>Serial Number</p>
        <input
          type="text"
          name="serialNumber"
          value={productDetails.serialNumber}
          onChange={(e) => {
            changeHandler(e);
          }}
          placeholder="Type here"
        />
      </div>



      <div className="addproduct-itemfield">
        <p>Price</p>
        <input
          type="text"
          name="price"
          value={productDetails.price}
          onChange={(e) => {
            changeHandler(e);
          }}
          placeholder="Type here"
        />
      </div>





      <div className="addproduct-itemfield">
        <p>Subject Name</p>
        <input
          type="text"
          name="subjectName"
          value={productDetails.subjectName}
          onChange={(e) => {
            changeHandler(e);
          }}
          placeholder="Type here"
        />
      </div>

      <div className="addproduct-itemfield">
        <p>Subject Year</p>
        <select
          name="year"
          value={productDetails.year}
          onChange={(e) => {
            changeHandler(e);
          }}
          className="addproduct-selector"
          style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #c3c3c3" }}
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
          value={productDetails.courseType}
          onChange={(e) => {
            changeHandler(e);
          }}
          className="addproduct-selector"
          style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #c3c3c3" }}
        >
          <option value="">Select Course Type</option>
          <option value="Challenge">Detailed Course</option>
          <option value="Detailed">Crash Course</option>
        </select>
      </div>
      <div
        className="addproduct-itemfield"
        style={{ marginTop: "20px", marginBottom: "20px" }}
      >
        <p>Subject Small Description</p>
        <input
          type="text"
          name="description"
          value={productDetails.description}
          onChange={(e) => {
            changeHandler(e);
          }}
          placeholder="Type here"
        />
      </div>

      <div className="addproduct-itemfield" style={{ marginBottom: "20px" }}>
        <p>Subject Image</p>
        <label htmlFor="file-input">
          <img
            className="addproduct-thumbnail-img"
            src={
              !image
                ? productDetails.imageUrl
                  ? productDetails.imageUrl
                  : upload_area
                : URL.createObjectURL(image)
            }
            alt=""
          />
        </label>
        <input
          onChange={(e) => setImage(e.target.files[0])}
          type="file"
          name="image"
          multiple
          id="file-input"
          accept="image/*"
          hidden
        />
        <span style={{ marginLeft: "20px" }}>Only png & jpeg allow</span>
      </div>

      {/* <button className="addproduct-btn" type="submit" onClick={e=>AddProduct(e)}>
        ADD
      </button> */}

      <LoadingButton
        onClick={(e) => AddProduct(e)}
        type="submit"
        loading={loading}
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading ? "Loading..." : "Edit Subject"}
      </LoadingButton>
    </div>
  );
};

export default AddProduct;
