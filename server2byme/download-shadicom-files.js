const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const { MongoClient } = require('mongodb');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const url = 'mongodb+srv://shakir973019:38Av2920Jt6uBzIu@cargarage.v8iwejy.mongodb.net/?retryWrites=true&w=majority&appName=DentalNotes';
const DOWNLOAD_DIR = path.join(__dirname, 'dental-notes-actual');

if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

function sanitize(name) {
  return name ? name.replace(/[<>:"/\\|?*\n\r]/g, '_').trim().substring(0, 80) : 'unknown';
}

function downloadFile(fileUrl, filePath) {
  return new Promise((resolve) => {
    if (!fileUrl) return resolve(null);
    const file = fs.createWriteStream(filePath);
    const get = fileUrl.startsWith('https') ? https.get.bind(https) : http.get.bind(http);
    get(fileUrl, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        try { fs.unlinkSync(filePath); } catch(e) {}
        return downloadFile(response.headers.location, filePath).then(resolve);
      }
      if (response.statusCode !== 200) {
        file.close();
        try { fs.unlinkSync(filePath); } catch(e) {}
        return resolve(null);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filePath);
      });
    }).on('error', () => {
      try { fs.unlinkSync(filePath); } catch(e) {}
      resolve(null);
    });
  });
}

async function main() {
  const client = new MongoClient(url);
  await client.connect();
  console.log('Connected to MongoDB!');
  const db = client.db('SHADICOM');

  const subjects = await db.collection('Subject').find({}).toArray();
  const chapters = await db.collection('Chapter').find({}).toArray();

  console.log(`Found ${subjects.length} subjects and ${chapters.length} chapters in SHADICOM database.`);

  const subjectMap = {};
  subjects.forEach(s => {
    subjectMap[s._id.toString()] = s.subjectName;
  });

  let downloadedCount = 0;

  for (const chapter of chapters) {
    const subjectName = subjectMap[chapter.subjectId?.toString()] || 'Unknown Subject';
    const chapterName = chapter.chapterName || 'Unnamed Chapter';
    const serial = chapter.serialNumber ? `${chapter.serialNumber}_` : '';

    const subjectFolder = path.join(DOWNLOAD_DIR, sanitize(subjectName));
    if (!fs.existsSync(subjectFolder)) {
      fs.mkdirSync(subjectFolder, { recursive: true });
    }

    console.log(`\n📖 Subject: ${subjectName} | Chapter: ${chapterName}`);

    if (chapter.pdfUrl) {
      const filePath = path.join(subjectFolder, `${serial}${sanitize(chapterName)}_notes.pdf`);
      console.log(`   Downloading Notes PDF: ${chapter.pdfUrl} -> ${filePath}`);
      const res = await downloadFile(chapter.pdfUrl, filePath);
      if (res) {
        console.log(`   ✅ Downloaded Notes PDF`);
        downloadedCount++;
      } else {
        console.log(`   ❌ Failed Notes PDF`);
      }
    }

    if (chapter.dictionaryUrl) {
      const filePath = path.join(subjectFolder, `${serial}${sanitize(chapterName)}_dictionary.pdf`);
      console.log(`   Downloading Dictionary PDF: ${chapter.dictionaryUrl} -> ${filePath}`);
      const res = await downloadFile(chapter.dictionaryUrl, filePath);
      if (res) {
        console.log(`   ✅ Downloaded Dictionary PDF`);
        downloadedCount++;
      } else {
        console.log(`   ❌ Failed Dictionary PDF`);
      }
    }

    if (chapter.videoUrl) {
      const ext = chapter.videoUrl.includes('.mkv') ? '.mkv' : '.mp4';
      const filePath = path.join(subjectFolder, `${serial}${sanitize(chapterName)}_video${ext}`);
      console.log(`   Downloading Video: ${chapter.videoUrl} -> ${filePath}`);
      const res = await downloadFile(chapter.videoUrl, filePath);
      if (res) {
        console.log(`   ✅ Downloaded Video`);
        downloadedCount++;
      } else {
        console.log(`   ❌ Failed Video`);
      }
    }
  }

  console.log(`\n\n🎉 DOWNLOAD PROCESS COMPLETE!`);
  console.log(`Total files downloaded successfully: ${downloadedCount}`);
  console.log(`Files saved in: ${DOWNLOAD_DIR}`);

  await client.close();
}

main().catch(console.error);
