const fs = require('fs');
let content = fs.readFileSync('Dashoard/src/Components/addChapter/AddChapter.jsx', 'utf8');

// Add state
content = content.replace(
  'const [DictionaryName, setDictionaryName] = useState(null);',
  'const [DictionaryName, setDictionaryName] = useState(null);\n  const [videofull, setVideofull] = useState(null);\n  const [videoName, setVideoName] = useState(null);'
);

// Add to formData
content = content.replace(
  'formData.append("dictionaryUrl", pdfarray?.[1]);',
  'formData.append("dictionaryUrl", pdfarray?.[1]);\n      if (videofull) formData.append("videoUrl", videofull);'
);

// Clear state on success
content = content.replace(
  'setDistionaryfullpdf(null);',
  'setDistionaryfullpdf(null);\n      setVideofull(null);\n      setVideoName(null);'
);

// Add UI
let newUI = `        <div className="addproduct-itemfield">
          <p>Chapter Video</p>
          <label htmlFor="file-input-video">
            <img
              className="addproduct-thumbnail-img"
              src={upload_area}
              alt=""
            />
          </label>
          <input
            type="file"
            onChange={(e) => {
              setVideofull(e.target.files[0]);
              setVideoName(e.target.files[0].name);
            }}
            name="videofull"
            id="file-input-video"
            accept="video/*"
            hidden
          />

          {videoName && (
            <p style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
              Video: <strong>{videoName}</strong>
            </p>
          )}
        </div>`;

content = content.replace(
  /<\/div>\s*<\/div>\s*<div className="addproduct-price"><\/div>/,
  `</div>\n\n${newUI}\n\n      </div>\n\n      <div className="addproduct-price"></div>`
);

fs.writeFileSync('Dashoard/src/Components/addChapter/AddChapter.jsx', content);
console.log('done AddChapter');
