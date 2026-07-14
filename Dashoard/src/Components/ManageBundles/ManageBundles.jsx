import React, { useState, useEffect } from "react";
import "../AddProduct/AddProduct.css";
import axios from "axios";
import { LoadingButton } from "@mui/lab";
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Box } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Clear as ClearIcon } from "@mui/icons-material";
import { toast } from "react-toastify";

const ManageBundles = () => {
  const [loading, setLoading] = useState(false);
  const [bundles, setBundles] = useState([]);
  const [bundleDetails, setBundleDetails] = useState({
    year: "",
    courseType: "",
    price: "",
    description: ""
  });

  const fetchBundles = async () => {
    try {
      const response = await axios.get("https://api.dentalnotesrep.com/api/v1/website/user/getBundlePrices");
      if (response.data.success || response.data.result) {
        setBundles(response.data.result.data || response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching bundles", error);
    }
  };

  useEffect(() => {
    fetchBundles();
  }, []);

  const changeHandler = (e) => {
    setBundleDetails({ ...bundleDetails, [e.target.name]: e.target.value });
  };

  const updateBundle = async (e) => {
    e.preventDefault();
    if (!bundleDetails.year || !bundleDetails.courseType || !bundleDetails.price) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://api.dentalnotesrep.com/api/v1/website/user/setBundlePrice",
        bundleDetails
      );

      if (response.data.success || response.data.result) {
        toast.success("Bundle Price Saved Successfully");
        setBundleDetails({
          year: "",
          courseType: "",
          price: "",
          description: ""
        });
        fetchBundles();
      }
    } catch (error) {
      console.error("Error updating bundle", error);
      toast.error("Failed to save bundle price");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bundle) => {
    setBundleDetails({
      year: bundle.year,
      courseType: bundle.courseType,
      price: bundle.price,
      description: bundle.description || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this bundle price?")) {
      try {
        const response = await axios.delete(`https://api.dentalnotesrep.com/api/v1/website/user/deleteBundlePrice/${id}`);
        if (response.data.success) {
          toast.success("Bundle Price Deleted");
          fetchBundles();
        }
      } catch (error) {
        console.error("Error deleting bundle", error);
        toast.error("Failed to delete bundle price");
      }
    }
  };

  const clearForm = () => {
    setBundleDetails({
      year: "",
      courseType: "",
      price: "",
      description: ""
    });
  };

  return (
    <div className="addproduct" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div className="add-bundle-form">
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>Set Bundle Price (Buy All Option)</Typography>
        
        <div className="addproduct-itemfield">
          <p>Select Year</p>
          <select
            name="year"
            value={bundleDetails.year}
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
            value={bundleDetails.courseType}
            onChange={changeHandler}
            className="add-product-selector"
          >
            <option value="">Select Category</option>
            <option value="Challenge">Detailed Course</option>
            <option value="Detailed">Crash Course</option>
            <option value="Full">Full Year Bundle (All Categories)</option>
          </select>
        </div>

        <div className="addproduct-itemfield">
          <p>Bundle Price (All Subjects)</p>
          <input
            type="number"
            name="price"
            value={bundleDetails.price}
            onChange={changeHandler}
            placeholder="Enter Total Price"
          />
        </div>

        <div className="addproduct-itemfield">
          <p>Description</p>
          <input
            type="text"
            name="description"
            value={bundleDetails.description}
            onChange={changeHandler}
            placeholder="e.g. Get access to all 1st Year Detailed Course subjects"
          />
        </div>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <LoadingButton
            onClick={updateBundle}
            loading={loading}
            variant="contained"
            sx={{ mt: 2, bgcolor: "#ef305c", "&:hover": { bgcolor: "#d92650" } }}
          >
            Save Bundle Price
          </LoadingButton>
          {(bundleDetails.year || bundleDetails.courseType || bundleDetails.price) && (
            <LoadingButton
              onClick={clearForm}
              variant="outlined"
              startIcon={<ClearIcon />}
              sx={{ mt: 2, color: "#ef305c", borderColor: "#ef305c", "&:hover": { borderColor: "#d92650", color: "#d92650" } }}
            >
              Clear
            </LoadingButton>
          )}
        </Box>
      </div>

      <div className="bundle-list">
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Current Bundle Prices</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: '#f9f9f9' }}>
              <TableRow>
                <TableCell>Year</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bundles.length > 0 ? (
                bundles.map((b) => (
                  <TableRow key={b._id}>
                    <TableCell>{b.year} Year</TableCell>
                    <TableCell>{b.courseType === "Challenge" ? "Detailed" : b.courseType === "Detailed" ? "Crash" : b.courseType} Course</TableCell>
                    <TableCell>₹{b.price}</TableCell>
                    <TableCell>{b.description}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEdit(b)} color="primary" size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(b._id)} color="error" size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">No bundle prices set yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default ManageBundles;
