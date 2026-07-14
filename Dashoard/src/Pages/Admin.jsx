import React from "react";
import "./CSS/Admin.css";
import Sidebar from "../Components/Sidebar/Sidebar";
//  
import { Route, Routes } from "react-router-dom";
import AddProduct from "../Components/AddProduct/AddProduct";
import ListProduct from "../Components/ListProduct/ListProduct";
import AddChapter from "../Components/addChapter/AddChapter";
import SubjectsPage from "../Components/overViewsubject/overView";
import ChapterOverView from "../Components/chapterOverView/overView"
import EditChapter from "../Components/addChapter/EditChapter"
import EditSubject from "../Components/AddProduct/EditSubject"
import OrgSettings from "../Components/OrgSettings/OrgSettings";
import AddDemoVideo from "../Components/AddDemoVideo/AddDemoVideo";
import ManageBundles from "../Components/ManageBundles/ManageBundles";
import ManageSubscription from "../Components/ManageSubscription/ManageSubscription";
import AddChapterVideo from "../Components/addChapterVideo/AddChapterVideo";

const Admin = () => {
 
  return (
    <div className="admin">
      <Sidebar />
      <Routes>
        <Route path="/orgSettings" element={<OrgSettings />} />
        <Route path="/addsubject" element={<AddProduct />} />
        <Route path="/addchapter" element={<AddChapter />} />
        <Route path="/addChapterVideo" element={<AddChapterVideo />} />
        <Route path="/addDemoVideo" element={<AddDemoVideo />} />
        <Route path="/manageBundles" element={<ManageBundles />} />
        <Route path="/manageSubscription" element={<ManageSubscription />} />
        <Route path="/overView" element={<SubjectsPage />} />
        <Route path="/chapterOverView/:id" element={<ChapterOverView />} />
        <Route path="/editChapter/:id" element={<EditChapter />} />
        <Route path="/editSubject/:id" element={<EditSubject />} />
      </Routes>
    </div>
  );
};

export default Admin;
