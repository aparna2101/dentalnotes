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
import { useNavigate } from "react-router-dom";

const subjectsData = [
  {
    id: 1,
    name: "Mathematics",
    description: "A subject focusing on numbers and equations.",
    image: "https://via.placeholder.com/150",
    chapters: [
      { id: 1, name: "Algebra" },
      { id: 2, name: "Geometry" },
      { id: 3, name: "Calculus" },
      { id: 3, name: "Calculus" },
      { id: 3, name: "Calculus" },
      { id: 3, name: "Calculus" },
      { id: 3, name: "Calculus" },
      { id: 3, name: "Calculus" },
    ],
  },
  {
    id: 2,
    name: "Physics",
    description: "A subject exploring the laws of nature.",
    image: "https://via.placeholder.com/150",
    chapters: [
      { id: 1, name: "Mechanics" },
      { id: 2, name: "Thermodynamics" },
      { id: 3, name: "Electromagnetism" },
    ],
  },

  {
    id: 1,
    name: "Mathematics",
    description: "A subject focusing on numbers and equations.",
    image: "https://via.placeholder.com/150",
    chapters: [
      { id: 1, name: "Algebra" },
      { id: 2, name: "Geometry" },
      { id: 3, name: "Calculus" },
    ],
  },
  
  {
    id: 1,
    name: "Mathematics",
    description: "A subject focusing on numbers and equations.",
    image: "https://via.placeholder.com/150",
    chapters: [
      { id: 1, name: "Algebra" },
      { id: 2, name: "Geometry" },
      { id: 3, name: "Calculus" },
    ],
  },
  {
    id: 1,
    name: "Mathematics",
    description: "A subject focusing on numbers and equations.",
    image: "https://via.placeholder.com/150",
    chapters: [
      { id: 1, name: "Algebra" },
      { id: 2, name: "Geometry" },
      { id: 3, name: "Calculus" },
    ],
  },
  {
    id: 1,
    name: "Mathematics",
    description: "A subject focusing on numbers and equations.",
    image: "https://via.placeholder.com/150",
    chapters: [
      { id: 1, name: "Algebra" },
      { id: 2, name: "Geometry" },
      { id: 3, name: "Calculus" },
    ],
  },
  {
    id: 1,
    name: "Mathematics",
    description: "A subject focusing on numbers and equations.",
    image: "https://via.placeholder.com/150",
    chapters: [
      { id: 1, name: "Algebra" },
      { id: 2, name: "Geometry" },
      { id: 3, name: "Calculus" },
    ],
  },
  {
    id: 1,
    name: "Mathematics",
    description: "A subject focusing on numbers and equations.",
    image: "https://via.placeholder.com/150",
    chapters: [
      { id: 1, name: "Algebra" },
      { id: 2, name: "Geometry" },
      { id: 3, name: "Calculus" },
    ],
  },
  {
    id: 1,
    name: "Mathematics",
    description: "A subject focusing on numbers and equations.",
    image: "https://via.placeholder.com/150",
    chapters: [
      { id: 1, name: "Algebra" },
      { id: 2, name: "Geometry" },
      { id: 3, name: "Calculus" },
    ],
  },
  {
    id: 1,
    name: "Mathematics",
    description: "A subject focusing on numbers and equations.",
    image: "https://via.placeholder.com/150",
    chapters: [
      { id: 1, name: "Algebra" },
      { id: 2, name: "Geometry" },
      { id: 3, name: "Calculus" },
    ],
  },
];

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
const navigate=useNavigate()
  const handleEditSubject = (id) => {
    console.log(`Edit Subject ID: ${id}`);
       navigate(`/admin/editSubject/${id}`)  
  };

  const handleDeleteSubject = async (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        await axios.delete(`https://api.dentalnotesrep.com/api/v1/website/user/removeSubject/${id}`)
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
    const response=await axios.get("https://api.dentalnotesrep.com/api/v1/website/user/getAllSubject");
    setSubjects(response.data.result.data) 
  } 

useEffect(()=>{
fetchSubject()
},[])

const handleNavigate=(_id)=>{

    navigate(`/admin/chapterOverView/${_id}`)


}


  return (
    <Box sx={{ padding: "24px",width:"100%" }} >
      <Typography variant="h4" sx={{ marginBottom: "24px", fontWeight: "bold" }}>
        Subjects
      </Typography>
      <Grid container spacing={1} sm={12} >
        {subjects?.sort((a, b) => {
        const aNum = a.serialNumber;
        const bNum = b.serialNumber;

        const isANull = aNum === null || aNum === undefined || aNum === 0;
        const isBNull = bNum === null || bNum === undefined || bNum === 0;

        if (isANull && !isBNull) return 1;
        if (!isANull && isBNull) return -1;
        return aNum - bNum;
      })
      ?.map((subject) => (
          <Grid item xs={12} sm={6} md={3} key={subject._id}>
            <Card sx={{ position: "relative", height: "100%",boxShadow:2,padding:1 }}>
              {/* Subject Image */}
              <CardMedia
                component="img"
                image={subject.imageUrl}
                alt={subject.name}
                sx={{ height: 150, objectFit: "cover" ,borderRadius:2}}
                onClick={e=>handleNavigate(subject._id)}
              />

              {/* Chapters Accordion */}
              
                  <Typography variant="h6">{subject.subjectName}</Typography>
               

              {/* Subject Description */}
              {/* <CardContent>
                <Typography variant="body2" sx={{ marginBottom: "16px" }}>
                  {subject.description}
                </Typography>
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
              </CardContent> */}

<CardContent>
  <Box
    sx={{
      display: "inline-block",
      backgroundColor: "#e3f2fd",
      color: "#0d47a1",
      borderRadius: "8px",
      px: 1.5,
      py: 0.5,
      fontSize: "0.8rem",
      fontWeight: 500,
      marginBottom: "8px",
    }}
  >
    Serial #{subject?.serialNumber ?? "—"}
  </Box>
  <Box
    sx={{
      display: "inline-block",
      backgroundColor: "#fce4ec",
      color: "#880e4f",
      borderRadius: "8px",
      px: 1.5,
      py: 0.5,
      fontSize: "0.8rem",
      fontWeight: 500,
      marginBottom: "8px",
      marginLeft: "8px",
    }}
  >
    {subject?.year ? `${subject.year} Year` : "No Year"}
  </Box>

  <Typography variant="body2" sx={{ marginBottom: "16px" }}>
    {subject.description}
  </Typography>

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
