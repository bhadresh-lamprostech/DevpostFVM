const express = require("express");
const multer = require("multer");
const { SpheronClient, ProtocolEnum } = require("@spheron/storage");
const cors = require("cors"); // Import the cors middleware

const app = express();
const upload = multer({ dest: "uploads/" });

// Spheron SDK initialization
const client = new SpheronClient({
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlLZXkiOiIwMzZiYjNhZGExNWM4NjQxM2Q2NGJlN2VlYWNkMTg2OTA3ZGU3MjlmOWQ2YjY0ZmU4ZTE4MmJmMjc3YTkyMTc4YzJmNzRmZTJhNTY3NmMwZTliOTNkMDI3NzRmMzdkZmM5ZGY3ODc3MjE0ZTAxNDg0NjhkZDkxMzMwYmQ3MTdmYiIsImlhdCI6MTY4NDg2NTY4MSwiaXNzIjoid3d3LnNwaGVyb24ubmV0d29yayJ9.BdQ2CtYXLx15sFL7ZDYp1Q4Wqw93wicmEarqXrql4lM",
});

// Enable CORS for all routes
app.use(cors());

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { filename, path } = req.file;
    console.log(req.file);
    console.log("helooooooooo");

    let currentlyUploaded = 0;

    const { uploadId, bucketId, protocolLink, dynamicLinks } = await client.upload(path, {
      protocol: ProtocolEnum.IPFS,
      name: filename,
      onUploadInitiated: (uploadId) => {
        console.log(`Upload with id ${uploadId} started...`);
      },
      onChunkUploaded: (uploadedSize, totalSize) => {
        currentlyUploaded += uploadedSize;
        console.log(`Uploaded ${currentlyUploaded} of ${totalSize} Bytes.`);
      },
    });

    // Additional processing or response handling

    res.status(200).json({ uploadId, bucketId, protocolLink, dynamicLinks });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlLZXkiOiIwYWU5NWJhZDFmNmI4ODk5NzBiNDg2M2FkZmM5N2NkNGY0ODlmY2ZhNzIyNDFiN2M2Yjc5M2E3ODdiMDQwZGFmYTZmNWRjMDVjNTljMDAxMzIwZGNlYjFhYzY1NzE0YzgwYjM4NTcwODQyNzZkMTJlN2IyYmMyMGE4MDRkNTUxMCIsImlhdCI6MTY4NDQ5NjUwOCwiaXNzIjoid3d3LnNwaGVyb24ubmV0d29yayJ9.TBI1qXKY3VAQAsWwiTCFxVVs79qlzLMWE4UI0zqGZ2o