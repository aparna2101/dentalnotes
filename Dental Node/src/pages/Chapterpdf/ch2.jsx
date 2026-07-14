import React, { useEffect, useState } from "react";
import Header from "../../component/Header/Header";
import Footer from "../../component/Footer/Footer";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link, useParams } from "react-router-dom";

import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

import "./Chapterpdf.css";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

const Chapterpdf = () => {
  const [subject, setSubject] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    const disableRightClick = (e) => e.preventDefault();
    document.addEventListener('contextmenu', disableRightClick);
  
    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
    };
  }, []);
  useEffect(() => {
    fetch("https://api.dentalnotesrep.com/subjects")
      .then((res) => res.json())
      .then((data) => setSubject(data));
  }, []);

  const { id } = useParams();
  console.log(id);

  return (
    <>
      <Header />
      <div>
        <div className="nav-slider md:w-[100%] w-[100%] text-sm mx-auto my-40">
          <div className="flex justify-center gap-8 flex-wrap ">
            <div className="md:w-[45%] shadow-lg p-4 rounded-lg">
              <div className="py-2 text-white bg-[#ef305c] rounded-xl">
                <h1 className="text-2xl text-center">Notes</h1>
              </div>

              <div className="py-2  ">
                {subject.map((item) => {
                  return (
                    <>
                      {item.chapaters.map((item2, index) => {
                        if (item2.name === id) {
                          return (
                            <>
                              <div className="py-2 flex gap-12 justify-center">
                                <button
                                  type="button"
                                  class="inline-flex items-center rounded-md border border-transparent bg-gray-800 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-900"
                                >
                                  <button
                                   onClick={() => setSelectedPdf(`https://api.dentalnotesrep.com/images/${item2.notedemopgf}`)}
                                    target="_blank"
                                  >
                                    Demo
                                  </button>
                                </button>

                                <button
                                  type="button"
                                  class="inline-flex items-center rounded-md border border-transparent bg-gray-800 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-900"
                                >
                                  <button
                                   onClick={() => setSelectedPdf(`https://api.dentalnotesrep.com/images/${item2.notefullpdf}`)}
                                    
                                    target="_blank"
                                  >
                                    Full pdf
                                  </button>
                                </button>
                              </div>

                               {/* Display selected PDF */}
      {selectedPdf && (

        
        <Swiper
navigation={true}
modules={[Navigation]}
className="mySwiper"
>
<SwiperSlide className=" text-center">
<div style={{ height: '100vh',width: '400px', border: '1px solid black' }}>
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer fileUrl={selectedPdf} />
          </Worker>
        </div>
</SwiperSlide>
<SwiperSlide className=" text-center">
  <div className=''>
  <div className='py-2 '>
  <h1 className='text-2xl'>Dictionary</h1>

  </div>
  <div className='py-2 flex gap-12 justify-center'>

      <button type="button" class="inline-flex items-center rounded-md border border-transparent bg-gray-800 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-900">Demo</button>

      <button type="button" class="inline-flex items-center rounded-md border border-transparent bg-gray-800 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-900">Full pdf</button>
  </div>


  </div>
</SwiperSlide>

</Swiper>
      )}
                            </>
                          );
                        }
                      })}
                    </>
                  );
                })}
              </div>
            </div>

            <div className="md:w-[45%] shadow-lg p-4 rounded-lg ">
              <div className="py-2 text-white bg-[#ef305c] rounded-xl ">
                <h1 className="text-2xl text-center">Dictionary</h1>
              </div>

              <div className="py-2  ">
                {subject.map((item) => {
                  return (
                    <>
                      {item.chapaters.map((item2, index) => {
                        if (item2.name === id) {
                          return (
                            <>
                              <div className="py-2 flex gap-12 justify-center">
                                <button
                                  type="button"
                                  class="inline-flex items-center rounded-md border border-transparent bg-gray-800 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-900"
                                >
                                  <a
                                    href={`https://api.dentalnotesrep.com/images/${item2.notedemopgf}`}
                                    target="_blank"
                                  >
                                    Demo
                                  </a>
                                </button>

                                <button
                                  type="button"
                                  class="inline-flex items-center rounded-md border border-transparent bg-gray-800 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-900"
                                >
                                  <a
                                    href={`https://api.dentalnotesrep.com/images/${item2.notefullpdf}`}
                                    target="_blank"
                                  >
                                    Full pdf
                                  </a>
                                </button>
                              </div>
                            </>
                          );
                        }
                      })}
                    </>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Chapterpdf;
