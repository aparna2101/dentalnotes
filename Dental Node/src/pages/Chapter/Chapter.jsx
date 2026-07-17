import React, { useEffect } from "react";
import Header from "../../component/Header/Header";
import Footer from "../../component/Footer/Footer";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import environment from "../../enviroment";
const Chapter = () => {
  const [subject, setSubject] = useState({});
  const [subjects, setSubjects] = useState({});

  const { id } = useParams();
  const navigate = useNavigate();

  async function fetchData() {
    try {
      const response = await axios.get(
        `${environment.endPoint}/api/v1/website/user/getAllChapterOfSubject/${id}`
      );

      console.log("hdhdhhdd", response.data.result);

      setSubjects(response.data.result.data);
    } catch (error) {
      console.log("error", error);
    }
  }

  useEffect(() => {
    fetchData();
    // fetch("https://api.dentalnotesrep.com/subjects")
    //   .then((res) => res.json())
    //   .then((data) => setSubject(data));
  }, [id]);

  useEffect(() => {
    console.log("chapter****testihgn***", subjects);
  }, [subjects]);

  //  const mysubject=subject.find((item)=>item._id===id)

  // console.log(mysubject.chapaters);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" style={{ marginTop: "24px" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            color: "#333",
            fontWeight: "bold",
            fontSize: "0.9rem",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "50px",
            cursor: "pointer",
            padding: "6px 12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            display: "inline-flex",
            alignItems: "center",
            marginBottom: "15px"
          }}
        >
          <span style={{ marginRight: '6px', fontSize: '1rem' }}>←</span> Back
        </button>

        <div class="relative h-full ml-0 mr-0 sm:mr-10 mt-10 mb-12">
          <span class="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-[#1353fe] rounded-lg"></span>
          <div class="relative h-full p-5 bg-white border-2 border-indigo-500 rounded-lg">
            <div class="flex items-center -mt-1">
              <h3 class="my-2 ml-3 text-lg font-bold text-gray-800">
                {subjects?.subjectName}
              </h3>
            </div>
            <p class="mt-3 mb-1 text-xs font-medium text-indigo-500 uppercase">
              ------------
            </p>

            {/* Extra Resources / Point-wise PDFs at the top */}
            {subjects.chapters?.filter(c => c.isChapter === false)
              ?.sort((a, b) => (a.serialNumber || 0) - (b.serialNumber || 0))
              ?.map((item) => (
                <div key={item._id} className="py-4">
                  <Link to={`/chapterpdf/${item._id}`}>
                    <strong>• {item.resourceType || "PYQs"} : </strong>
                    {item.chapterName}
                  </Link>
                </div>
              ))
            }

            {/* Standard Numbered Chapters below */}
            {subjects.chapters?.filter(c => c.isChapter !== false)
              ?.sort((a, b) => {
                const aNum = a.serialNumber;
                const bNum = b.serialNumber;

                // Check for null, undefined, or 0 — they should come last
                const isANull = aNum === null || aNum === undefined || aNum === 0;
                const isBNull = bNum === null || bNum === undefined || bNum === 0;

                if (isANull && !isBNull) return 1;   // a should come after b
                if (!isANull && isBNull) return -1;  // a should come before b

                // If both are valid, sort normally
                return aNum - bNum;
              })
              ?.map((item, index) => {
                return (
                  <div key={item._id} className="py-4">
                    <Link to={`/chapterpdf/${item._id}`}>
                      <strong>Chapter {index + 1} : </strong>
                      {item.chapterName}
                    </Link>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      {/* <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-32 mb-12'>
<Tabs>
    <TabList>
      <Tab>Title 1</Tab>
      <Tab>Title 2</Tab>
    </TabList>

    <TabPanel>
      <h2>Any content 1</h2>
    </TabPanel>
    <TabPanel>
      <h2>Any content 2</h2>
    </TabPanel>
  </Tabs>
</div> */}

      <Footer />
    </>
  );
};

export default Chapter;
