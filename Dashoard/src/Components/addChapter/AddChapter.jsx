import React, { useState, useEffect } from "react";
import "../AddProduct/AddProduct.css";
import upload_area from "../Assets/upload_area.svg";
import axios from "axios";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { backend_url } from "../../App";

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

  // Resource Upload Form States
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceSubjectId, setResourceSubjectId] = useState("");
  const [resourcePdf, setResourcePdf] = useState(null);
  const [resourcePdfName, setResourcePdfName] = useState("");
  const [resourceLoading, setResourceLoading] = useState(false);
  const [resourceSearch, setResourceSearch] = useState("");
  const [resourceYear, setResourceYear] = useState("");
  const [resourceType, setResourceType] = useState("PYQs");

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
      formData.append("isChapter", "true");

      const response = await axios.post(
        `${backend_url}/api/v1/website/user/createChapter`,
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

  const addResource = async () => {
    try {
      if (!resourceTitle || !resourceSubjectId || !resourcePdf) {
        toast.warning("Please fill Title, Select Subject and Upload PDF");
        return;
      }
      setResourceLoading(true);

      let formData = new FormData();
      formData.append("pdfUrl", resourcePdf);
      formData.append("chapterName", resourceTitle);
      formData.append("subjectId", resourceSubjectId);
      formData.append("isChapter", "false"); // Point-wise PDF
      formData.append("resourceType", resourceType || "PYQs");

      const response = await axios.post(
        `${backend_url}/api/v1/website/user/createChapter`,
        formData
      );

      if (response.data.result.success) {
        toast.success(response?.data?.result?.message || "Point-wise PDF added successfully");
      }

      setResourceTitle("");
      setResourceSubjectId("");
      setResourcePdf(null);
      setResourcePdfName("");
      setResourceType("PYQs");
      setResourceLoading(false);
    } catch (error) {
      console.error("Error while creating resource:", error);
      setResourceLoading(false);
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Something went wrong";
      toast.error(errorMsg);
    }
  };

  async function fetchSubject() {
    try {
      const response = await axios.get(
        `${backend_url}/api/v1/website/user/getAllSubject`
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
    <div style={{ display: "flex", flexDirection: "column", gap: "40px", padding: "20px", width: "100%" }}>
      
      {/* SECTION 1: ADD STANDARD CHAPTER */}
      <div className="addproduct" style={{ margin: 0, width: "100%", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "24px", backgroundColor: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>


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
          Submit Chapter
        </LoadingButton>
      </div>

      {/* SECTION 2: ADD POINT-WISE PDF / RESOURCE */}
      <div className="addproduct" style={{ margin: 0, width: "100%", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "24px", backgroundColor: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>


        <div className="addproduct-itemfield">
          <p>Resource / PDF Name (e.g. Syllabus)</p>
          <input
            type="text"
            value={resourceTitle}
            onChange={(e) => setResourceTitle(e.target.value)}
            placeholder="Type Resource Name (e.g. Syllabus, Reference Book Name)"
          />
        </div>

        <div className="addproduct-itemfield">
          <p>Resource Prefix Label (e.g. PYQs, Syllabus, PDF)</p>
          <input
            type="text"
            value={resourceType}
            onChange={(e) => setResourceType(e.target.value)}
            placeholder="Type Resource Prefix (e.g. PYQs)"
          />
        </div>

        <h4 className="addproduct-itemfield">Upload PDF</h4>

        <div className="addproduct-price" style={{ gridTemplateColumns: "1fr" }}>
          <div className="addproduct-itemfield">
            <p>Notes / Resource PDF</p>
            <label htmlFor="resource-file-input">
              <img
                className="addproduct-thumbnail-img"
                src={upload_area}
                alt="Upload"
              />
            </label>
            <input
              type="file"
              onChange={(e) => {
                setResourcePdf(e.target.files[0]);
                setResourcePdfName(e.target.files[0].name);
              }}
              id="resource-file-input"
              accept=".pdf"
              hidden
            />
            {resourcePdfName && (
              <p style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
                Selected PDF: <strong>{resourcePdfName}</strong>
              </p>
            )}
          </div>
        </div>

        <div className="addproduct-itemfield" style={{ marginTop: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p>Select Year</p>
          </div>
          <select
            value={resourceYear}
            onChange={(e) => setResourceYear(e.target.value)}
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
            value={resourceSearch}
            onChange={(e) => setResourceSearch(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #c3c3c3", marginBottom: "10px" }}
          />
          <p>Select Subject</p>
          <select
            value={resourceSubjectId}
            className="add-product-selector"
            onChange={(e) => setResourceSubjectId(e.target.value)}
          >
            <option value={""}>
              {resourceSearch || resourceYear ? "--- Matches Found ---" : "select subject"}
            </option>
            {subjecOption
              .filter(subject => (!resourceYear || subject.year === resourceYear))
              .filter(subject => (!resourceSearch || subject.subjectName.toLowerCase().includes(resourceSearch.toLowerCase())))
              .map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.subjectName} {subject.year ? `(${subject.year} Year)` : ""}
                </option>
              ))}
          </select>
        </div>

        <LoadingButton
          onClick={addResource}
          type="submit"
          loading={resourceLoading}
          variant="contained"
          color="primary"
          disabled={resourceLoading}
          sx={{ my: 2 }}
        >
          Submit Resource PDF
        </LoadingButton>
      </div>

    </div>
  );
};

export default AddChapter;
