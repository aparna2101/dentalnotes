import React, { useState } from "react";
import "./About.css";

import { Link } from "react-router-dom";

const About = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const loadIframe = () => {
    setIsLoaded(true);
  };

  return (
    <div>
      <div className="responsive-container-block bigContainer">
        <div className="responsive-container-block Container bottomContainer">
          <div className="allText bottomText" data-aos="zoom-in-right">
            <p className="text-blk headingText">About</p>
            <p className="text-blk subHeadingText">
              Salient Features of Notes:
            </p>
            <div className="salient-features-grid">
              <p className="text-blk description">
                Self-understandable notes with 24/7 dictionary support.
              </p>
              <p className="text-blk description">
                Theory + practical notes for all subjects.
              </p>
              <p className="text-blk description">
                Chapter wise Flashcard videos
              </p>
              <p className="text-blk description">
                Updated yearly with new questions.
              </p>
              <p className="text-blk description">
                Chapter-wise and question-wise dictionary.
              </p>
              <p className="text-blk description">
                Exam-ready, concise answers.
              </p>
              <p className="text-blk description">
                Highlighted keywords for quick retention.
              </p>
              <p className="text-blk description">
                Core concepts in simple points.
              </p>
              <p className="text-blk description">
                Easy mnemonics for better memory.
              </p>
            </div>


          </div>

          {/* Dont remove below imp  */}

          {/* <div className="videoContainer" data-aos="zoom-in-left">
            {!isLoaded ? (
              <div
                className="absolute w-full h-full bg-cover bg-center flex items-center justify-center"
                style={{
                  backgroundImage: `url(../img/video-1.jpg)`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                }}
                onClick={loadIframe}
              >
                <div className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center text-white text-3xl">
                  ▶
                </div>
              </div>
            ) : (
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/q3Zg20ABbn8?autoplay=1"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="About Video"
              />
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default About;
