import React, { useState } from "react";
import "../AddProduct/AddProduct";
import upload_area from "../Assets/upload_area.svg";
import { useEffect } from "react";
import axios from "axios";
import { backend_url } from "../../App";

import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const AddChapter = () => {
  const [loading, setLoading] = useState(false);

  // console.log(subject);

  const [notedemopgf, setNotedemopgf] = useState();
  const [notefullpdf, setNotefullpdf] = useState();
  const [distionarydemopdf, setDistionarydemopdf] = useState();
  const [distionaryfullpdf, setDistionaryfullpdf] = useState();
  const [subjecOption, setSubjectOption] = useState([]);
  const [dictionaryFileName, setDictionaryFileName] = useState("");
  const [notePdfName, setNotePdfName] = useState("");
  const { id } = useParams();

  const [chapterDetails, setChapterDetails] = useState({
    name: "",
    subjectname: "",
    subjectId: "",
    allpdf: [],
  });

  const changeHandler = (e) => {
    setChapterDetails({ ...chapterDetails, [e.target.name]: e.target.value });
  };
  // console.log(chapterDetails);

  const addChapters = async () => {
    try {
      let pdfarray = [notefullpdf, distionaryfullpdf];
      console.log(pdfarray);
      setLoading(true);

      let formData = new FormData();

      formData.append("pdfUrl", pdfarray?.[0]);
      formData.append("dictionaryUrl", pdfarray?.[1]);
      formData.append("chapterName", chapterDetails.chapterName);
      formData.append("subjectId", chapterDetails.subjectId);
      formData.append("serialNumber", chapterDetails.serialNumber);
      formData.append("isChapter", chapterDetails.isChapter !== undefined ? chapterDetails.isChapter : true);
      formData.append("resourceType", chapterDetails.resourceType || "PYQs");
      const response = await axios.put(
        `${backend_url}/api/v1/website/user/updateChapter/${id}`,
        formData
      );

      if(response.data.success){
        toast.success("Chapter updated");
       
          setNotefullpdf(null);
          setNotePdfName("");
          setDictionaryFileName("");
          setDistionaryfullpdf(null);
         
          
      }

      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
        toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  async function fetchSubject() {
    const response = await axios.get(
      `${backend_url}/api/v1/website/user/getAllSubject`
    );
    console.log("your response", response.data.result.data);
    setSubjectOption(response.data.result.data);
  }

  async function fetchChapter() {
   try {

     const token=localStorage.getItem("token")
    const response = await axios.get(
      `${backend_url}/api/v1/website/user/getChapterById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // 👈 Add your token here
        },
      }
    );
    console.log("your chapter", response.data.result.data.chapter);
    setChapterDetails({
      ...chapterDetails,
      ...response?.data?.result?.data?.chapter,
    });
    
   } catch (error) {
debugger
    toast.error(error?.response?.data?.message||"something went wrong")
    
   }
  }

  useEffect(() => {
    fetchSubject();
  }, []);

  useEffect(() => {
    fetchChapter();
  }, [id]);

  // useEffect(() => {
  //     fetch("https://api.dentalnotesrep.com/subjects")
  //       .then((res) => res.json())
  //       .then((data) => setSubject(data));
  //   }, []);

  useEffect(() => {
    console.log("chapter Detail", chapterDetails);
  }, [chapterDetails]);

  // const handleFileChange = (e) => {
  //     const file = e.target.files[0];
  //     const name=e.target.name
  //     if (file) {
  //       setNoteFullPdf(file); // Store the file
  //       setFileName(file.name); // Update the file name

  //     }
  //   };

  return (
    <div className="addproduct">

      {chapterDetails.isChapter !== false && (
        <div className="addproduct-itemfield">
          <p>SerialNumber</p>
          <input
            type="text"
            name="serialNumber"
            value={chapterDetails.serialNumber}
            onChange={(e) => {
              changeHandler(e);
            }}
            placeholder="Type here"
          />
        </div>
      )}


      <div className="addproduct-itemfield">
        <p>Chapter Name</p>
        <input
          type="text"
          name="chapterName"
          value={chapterDetails.chapterName}
          onChange={(e) => {
            changeHandler(e);
          }}
          placeholder="Type here"
        />
      </div>

      {chapterDetails.isChapter === false && (
        <div className="addproduct-itemfield">
          <p>Resource Prefix Label (e.g. PYQs, Syllabus, PDF)</p>
          <input
            type="text"
            name="resourceType"
            value={chapterDetails.resourceType || "PYQs"}
            onChange={changeHandler}
            placeholder="Type Resource Prefix (e.g. PYQs)"
          />
        </div>
      )}






      <div className="addproduct-price" style={{ marginTop: "40px", gridTemplateColumns: chapterDetails.isChapter === false ? "1fr" : "" }}>
        <div className="addproduct-itemfield">
          <p>{chapterDetails.isChapter === false ? "Notes / Resource PDF" : "Notes PDF"}</p>
          <label htmlFor="file-input2" style={{ cursor: "pointer" }}>
            <img
              className="addproduct-thumbnail-img"
              src={upload_area}
              alt="Upload area"
            />
          </label>
          <input
            type="file"
            onChange={(e) => {
              setNotefullpdf(e.target.files[0]);
              setNotePdfName(e.target.files[0].name);
            }}
            name="notefullpdf"
            id="file-input2"
            accept="application/pdf"
            hidden
          />
          {notePdfName && (
            <p style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
              Note PDF : <strong>{notePdfName}</strong>
            </p>
          )}
        </div>




        {chapterDetails.isChapter !== false && (
          <div className="addproduct-itemfield">
            <p>Dictionary PDF</p>
            <label htmlFor="file-input3" style={{ cursor: "pointer" }}>
              <img
                className="addproduct-thumbnail-img"
                src={upload_area}
                alt="Upload area"
              />
            </label>
            <input
              type="file"
              onChange={e=>{setDistionaryfullpdf(e.target.files[0]);setDictionaryFileName(e.target.files[0].name)}}
              name="dictionaryfullpdf"
              id="file-input3"
              accept="application/pdf"
              hidden
            />
            {dictionaryFileName && (
              <p style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
                Dictionary PDF: <strong>{dictionaryFileName}</strong>
              </p>
            )}
          </div>
        )}
      </div>

      <div className="addproduct-itemfield" style={{ marginTop: "40px" }}>
        <p>Subject Name</p>
        <select
          value={chapterDetails.subjectId}
          name="subjectId"
          className="add-product-selector"
          onChange={changeHandler}
          disabled
        >
          <option disabled value={""}>
            select subject
          </option>
          {subjecOption.map((subject) => (
            <option value={subject._id}>{subject.subjectName}</option>
          ))}
        </select>
      </div>

      {/* <button className="addproduct-btn" type="submit" onClick={addChapters}>ADD</button> */}
      <LoadingButton
        onClick={addChapters}
        type="submit"
        loading={loading}
        variant="contained"
        color="primary"
        disabled={loading}
        sx={{
          my: 4,
        }}
      >
        {loading ? "Loading..." : "Edit Chapter"}
      </LoadingButton>
      {/* <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      
    </Box> */}
    </div>
  );
};

export default AddChapter;
