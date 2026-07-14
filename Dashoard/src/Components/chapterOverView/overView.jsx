import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";



const SubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const navigate=useNavigate()
const {id}=useParams()
  const handleEditSubject = (id) => {
    console.log(`Edit Subject ID: ${id}`);
    navigate(`/admin/editChapter/${id}`)
    // Add your edit logic here
  };

  const handleDeleteSubject = async (id) => {
    if (window.confirm("Are you sure you want to delete this chapter?")) {
      try {
        await axios.delete(`https://api.dentalnotesrep.com/api/v1/website/user/removeChapter/${id}`)
        const updatedSubjects = subjects.filter((subject) => subject._id !== id);
        setSubjects(updatedSubjects);
      } catch (error) {
        console.log("error",error)
      }
    }
  };

  const handleEditChapter = (subjectId, chapterId) => {
    console.log(`Edit Chapter ID: ${chapterId} in Subject ID: ${subjectId}`);
    // Add your edit logic here
  };

  const handleDeleteChapter = (subjectId, chapterId) => {
    const updatedSubjects = subjects.map((subject) => {
      if (subject.id === subjectId) {
        return {
          ...subject,
          chapters: subject.chapters.filter(
            (chapter) => chapter.id !== chapterId
          ),
        };
      }
      return subject;
    });
    setSubjects(updatedSubjects);
  };


  async function fetchSubject(params) {
    const response=await axios.get(`https://api.dentalnotesrep.com/api/v1/website/user/getAllChapterOfSubject/${id}`);
    setSubjects(response.data.result.data.chapters) 
  } 

useEffect(()=>{
fetchSubject()
},[id])


  return (
    <Box sx={{ padding: "24px",width:"100%" }} >
      <Typography variant="h4" sx={{ marginBottom: "24px", fontWeight: "bold" }}>
        Chapters
      </Typography>
      <Grid container spacing={1} sm={12} >
        {subjects.map((subject) => (
          <Grid item xs={12} sm={6} md={3} key={subject._id}>
            <Card sx={{ position: "relative", height: "100%",boxShadow:2,padding:1 }}>
              {/* Subject Image */}
              {/* <CardMedia
                component="img"
                image={subject.imageUrl}
                alt={subject.name}
                sx={{ height: 150, objectFit: "cover" ,borderRadius:2}}
              /> */}

              {/* Chapters Accordion */}
              
                  <Typography variant="h6">Chapter : {subject.chapterName}</Typography>
               

              {/* Subject Description */}
              <CardContent>
               
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button
                    variant="outlined"
                    onClick={() => handleEditSubject(subject._id)}
                    sx={{
                      textTransform: "none",
                      borderColor: "#007bff",
                      color: "#007bff",
                      ":hover": { borderColor: "#0056b3", color: "#0056b3" },
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleDeleteSubject(subject._id)}
                    sx={{
                      textTransform: "none",
                      borderColor: "#dc3545",
                      color: "#dc3545",
                      ":hover": { borderColor: "#a71d2a", color: "#a71d2a" },
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SubjectsPage;
