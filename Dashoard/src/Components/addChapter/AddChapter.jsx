import React, { useState, useEffect } from "react";
import "../AddProduct/AddProduct.css";
import upload_area from "../Assets/upload_area.svg";
import axios from "axios";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";

const AddChapter = () => {
  const [loading, setLoading] = useState(false);
  const [notefullpdf, setNotefullpdf] = useState(null);
  const [distionaryfullpdf, setDistionaryfullpdf] = useState(null);
  const [DictionaryName, setDictionaryName] = useState(null);
  const [pdfName, setPdfName] = useState(null);
  const [subjecOption, setSubjectOption] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [chapterDetails, setChapterDetails] = useState({
    name: "",
    subjectId: "",
  });

  const changeHandler = (e) => {
    setChapterDetails({ ...chapterDetails, [e.target.name]: e.target.value });
  };

  const addChapters = async () => {
    try {
      if (!chapterDetails.name || !chapterDetails.subjectId) {
        toast.warning("Please fill Chapter Name and Select Subject");
        return;
      }
      setLoading(true);

      let formData = new FormData();
      if (notefullpdf) formData.append("pdfUrl", notefullpdf);
      if (distionaryfullpdf) formData.append("dictionaryUrl", distionaryfullpdf);
      formData.append("chapterName", chapterDetails.name);
      formData.append("subjectId", chapterDetails.subjectId);

      const response = await axios.post(
        "https://api.dentalnotesrep.com/api/v1/website/user/createChapter",
        formData
      );

      if (response.data.result.success) {
        toast.success(response?.data?.result?.message || "Chapter created successfully");
      }

      setChapterDetails({
        name: "",
        subjectId: "",
      });
      setNotefullpdf(null);
      setPdfName(null);
      setDictionaryName(null);
      setDistionaryfullpdf(null);
      setLoading(false);
    } catch (error) {
      console.error("Error while creating chapter:", error);
      setLoading(false);
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Something went wrong";
      toast.error(errorMsg);
    }
  };

  async function fetchSubject() {
    try {
      const response = await axios.get(
        "https://api.dentalnotesrep.com/api/v1/website/user/getAllSubject"
      );
      setSubjectOption(response.data.result.data || []);
    } catch (error) {
      toast.error("Failed to fetch subjects");
    }
  }

  useEffect(() => {
    fetchSubject();
    window.addEventListener("focus", fetchSubject);
    return () => window.removeEventListener("focus", fetchSubject);
  }, []);

  return (
    <div className="addproduct">
      <div className="addproduct-itemfield">
        <p>Chapter Name</p>
        <input
          type="text"
          name="name"
          value={chapterDetails.name}
          onChange={changeHandler}
          placeholder="Type here"
        />
      </div>

      <h4 className="addproduct-itemfield">All PDF</h4>

      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Notes Full PDF</p>
          <label htmlFor="file-input2">
            <img
              className="addproduct-thumbnail-img"
              src={upload_area}
              alt="Upload"
            />
          </label>
          <input
            type="file"
            onChange={(e) => {
              setNotefullpdf(e.target.files[0]);
              setPdfName(e.target.files[0].name);
            }}
            name="notefullpdf"
            id="file-input2"
            accept=".pdf"
            hidden
          />
          {pdfName && (
            <p style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
              Note PDF: <strong>{pdfName}</strong>
            </p>
          )}
        </div>

        <div className="addproduct-itemfield">
          <p>Dictionary Full PDF</p>
          <label htmlFor="file-input4">
            <img
              className="addproduct-thumbnail-img"
              src={upload_area}
              alt="Upload"
            />
          </label>
          <input
            type="file"
            onChange={(e) => {
              setDistionaryfullpdf(e.target.files[0]);
              setDictionaryName(e.target.files[0].name);
            }}
            name="distionaryfullpdf"
            id="file-input4"
            accept=".pdf"
            hidden
          />
          {DictionaryName && (
            <p style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
              Dictionary PDF: <strong>{DictionaryName}</strong>
            </p>
          )}
        </div>
      </div>

      <div className="addproduct-price"></div>

      <div className="addproduct-itemfield">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p>Select Year</p>
          <button 
            onClick={fetchSubject} 
            style={{ fontSize: "12px", color: "#007bff", cursor: "pointer", background: "none", border: "none", textDecoration: "underline" }}
          >
            Refresh Subjects
          </button>
        </div>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
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
          value={chapterDetails.subjectId}
          name="subjectId"
          className="add-product-selector"
          onChange={changeHandler}
        >
          <option value={""}>
            {searchTerm || selectedYear ? "--- Matches Found ---" : "select subject"}
          </option>
          {subjecOption
            .filter(subject => (!selectedYear || subject.year === selectedYear))
            .filter(subject => (!searchTerm || subject.subjectName.toLowerCase().includes(searchTerm.toLowerCase())))
            .map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.subjectName} {subject.year ? `(${subject.year} Year)` : ""}
              </option>
            ))}
        </select>
      </div>

      <LoadingButton
        onClick={addChapters}
        type="submit"
        loading={loading}
        variant="contained"
        color="primary"
        disabled={loading}
        sx={{ my: 2 }}
      >
        Submit
      </LoadingButton>
    </div>
  );
};

export default AddChapter;
