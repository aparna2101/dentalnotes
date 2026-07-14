import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../Assets/upload_area.svg";
import axios from "axios";

import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/material";
import { toast } from "react-toastify";

const AddProduct = () => {
  const [image, setImage] = useState(false);
  // const [subjecName,setSubjectName]=useState(" ")
  // const [descripton,setdescription]=useState(" ")

  const [loading, setLoading] = useState(false);

  const [productDetails, setProductDetails] = useState({
    name: "",
    description: "",
    image: "",
  });

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const AddProduct = async (e) => {
    try {
      let dataObj;
      let product = productDetails;
      setLoading(true);
      e.preventDefault();
      let formData = new FormData();
      formData.append("image", image);
      formData.append("subjectName", productDetails.name);
      formData.append("description", productDetails.description);

      const response = await axios.post(
        "https://api.dentalnotesrep.com/api/v1/website/user/createSubject",
        formData
      );

      if (response?.data?.result?.success) {
        toast.success(response?.data?.result?.message);
      }

      setProductDetails({ name: "", description: "" });
      setImage("");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="addproduct">
      <div className="addproduct-itemfield">
        <p>Subject Name</p>
        <input
          type="text"
          name="name"
          value={productDetails.name}
          onChange={(e) => {
            changeHandler(e);
          }}
          placeholder="chapter Name should be unique"
        />
      </div>
      <div className="addproduct-itemfield">
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

      <Box sx={{ my: 2 }}>
        <div className="addproduct-itemfield">
          <p>Subject Image</p>
          <label htmlFor="file-input">
            <img
              className="addproduct-thumbnail-img"
              src={!image ? upload_area : URL.createObjectURL(image)}
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
        </div>
      </Box>

      {/* <button className="addproduct-btn" type="submit" onClick={e=>AddProduct(e)}>
        ADD
      </button> */}

      <LoadingButton
        sx={{ my: 2 }}
        onClick={(e) => AddProduct(e)}
        type="submit"
        loading={loading}
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading ? "Loading..." : "Submit"}
      </LoadingButton>
    </div>
  );
};

export default AddProduct;
