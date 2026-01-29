// upload-service/index.js
const express = require("express");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { randomUUID } = require("crypto");
const path = require("path");
const fs = require("fs");

const UPLOAD_DIR = process.env.UPLOAD_DIR || "/usr/src/app/files";
const JWT_SECRET = process.env.JWT_SECRET || ""; // or use public key if RS256
const DJANGO_INTERNAL_VERIFY = process.env.DJANGO_VERIFY_URL || "http://django:8000/api/token/verify/";
const DJANGO_REGISTER = process.env.DJANGO_REGISTER_URL || "http://django:8000/api/files/new/";
const MAX_FILE_BYTES = parseInt(process.env.MAX_FILE_BYTES || `${1024 * 1024 * 1024}`); // 1GB default


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const id = randomUUID();
    // keep original extension
    const ext = path.extname(file.originalname);
    cb(null, `${id}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_BYTES },
});

const app = express();

app.post("/upload", async (req, res, next) => {
  console.log("NEW UPLOAD REQUEST: ");
  // 1) check Authorization header
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token" });
  }
  const token = auth.slice(7);

  console.log("RECEIVED TOKEN: " + token);
  // 2) Option A: local JWT verify
  try {
    const verify = await fetch(DJANGO_INTERNAL_VERIFY, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    if (!verify.ok) return res.status(401).json({ error: "Invalid token sito" });
    const payload = await verify.json();
    req.user = payload;
    
  } catch (err) {
    // Option B: fallback to asking Django (uncomment if desired)
    console.log("Internal error trying to check access token");
    return res.status(401).json({ error: "Invalid token bro" });
  }

  // Expected SHA256 from client (hex string)
  const expectedSha = req.headers["x-file-sha256"];
  if (!expectedSha || typeof expectedSha !== "string" || expectedSha.length !== 64) {
    return res.status(400).json({
      error:
        "Missing or invalid X-File-Sha256 header (expect 64-char hex SHA256)",
    });
  }

  // 3) Use multer to handle multipart and stream to disk
  upload.single("file")(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });


    const filePath = req.file.path;
    const fileStream = fs.createReadStream(filePath);
    const hash = crypto.createHash("sha256");

    try {
      // 4. Compute actual SHA256 of saved file
      for await (const chunk of fileStream) {
        hash.update(chunk);
      }
      const actualSha = hash.digest("hex");

      // 5. Compare SHA256 hashes
      if (actualSha !== expectedSha.toLowerCase()) {
        await fs.promises.unlink(filePath); // delete bad file
        return res.status(400).json({
          error: "Checksum mismatch",
          expected: expectedSha,
          actual: actualSha,
        });
      }

      // saved file metadata
      const fileRecord = {
        filename: req.file.filename,
        path: req.file.path,
        originalName: req.file.originalname,
        size: req.file.size,
        contentType: req.file.mimetype,
        sha256: actualSha,
        user: req.user?.sub ?? null, // depends on your JWT payload
      };

      // 4) Notify Django (internal)
      //console.log(`token: ${token}`);
      let response = ''

      try {
        response = await fetch(DJANGO_REGISTER, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // let Django re-check if needed
          },
          body: JSON.stringify(fileRecord),
        });
        console.log("FILE RECORD: " + JSON.stringify(fileRecord));
      } catch (notifyErr) {
        console.error("Failed to notify Django:", notifyErr);
        // (optionally) cleanup file or mark for retry
      }

      response_data = await response.json();
      //res.json({ success: true, file_id: `${response_data.file_id}` });
      console.log("NEW FILE REGISTERED");
      return res.status(201).json({ success: true, file_id: `${response_data.file_id}` })
    }
    catch (hashErr) {
      console.log("NEW FILE REGISTRATION ERROR");
      console.error("Hash computation failed:", hashErr);
      return res.status(500).json({ error: "Server error computing hash" });
    }
  });
});

(async () => {
  try {
    await fs.promises.mkdir(UPLOAD_DIR, { recursive: true });
    app.listen(4000, () => console.log(`Upload service listening on port 4000`));
  } catch (err) {
    console.error("Failed to create upload directory:", err);
    process.exit(1);
  }
})();
